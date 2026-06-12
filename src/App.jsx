import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import StepRail from "./components/StepRail.jsx";
import Composer from "./components/Composer.jsx";
import ThinkingStream from "./components/ThinkingStream.jsx";
import Step1Discovery from "./components/Step1Discovery.jsx";
import Step2Thinking from "./components/Step2Thinking.jsx";
import Step3Analytics from "./components/Step3Analytics.jsx";
import Step4Report from "./components/Step4Report.jsx";
import { AGENTS, INITIAL_HISTORY, buildLiveReport, answerQuestion } from "./data/analyst.js";

const USER_NAME = "Ranouna";

const SUGGESTIONS = [
  { label: "Summarize support", prompt: "Summarize seller support conversations and surface the top operational friction points." },
  { label: "Find friction", prompt: "Find the contact drivers causing repeat tickets and recommend macros to reduce them." },
  { label: "Weekly digest", prompt: "Build a weekly digest of unresolved fulfillment and returns escalations by owner." },
  { label: "Onboarding review", prompt: "Analyze new seller onboarding tickets and explain where the journey breaks down." },
];

function greetingText() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  return `Good ${part}, ${USER_NAME}`;
}

export default function App() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(0);
  const [view, setView] = useState("flow"); // 'flow' | 'history'
  const [openReportId, setOpenReportId] = useState(null);

  const [prompt, setPrompt] = useState(
    "Summarize seller support conversations, identify operational friction, and produce a leadership-ready report."
  );
  const [objective, setObjective] = useState("");
  const [liveReport, setLiveReport] = useState(null);

  // Agent runtime (Step 2)
  const [agentIndex, setAgentIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [ready, setReady] = useState(false);
  const [edits, setEdits] = useState({});
  const timers = useRef([]);

  // Follow-up chat
  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState([]);
  const [pending, setPending] = useState(false);

  const greeting = useMemo(greetingText, []);
  const viewingHistory = view === "history" && openReportId !== null;
  const currentReport = viewingHistory ? history.find((r) => r.id === openReportId) : liveReport;

  // Reveal the current agent's thoughts, then mark ready for approval.
  useEffect(() => {
    if (view !== "flow" || step !== 2) return undefined;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRevealed(0);
    setReady(false);
    const agent = AGENTS[agentIndex];
    agent.thoughts.forEach((_, i) => {
      timers.current.push(setTimeout(() => setRevealed(i + 1), 450 * (i + 1)));
    });
    timers.current.push(setTimeout(() => setReady(true), 450 * (agent.thoughts.length + 1)));
    return () => timers.current.forEach(clearTimeout);
  }, [step, agentIndex, view]);

  // Reset the follow-up thread whenever the displayed report changes.
  useEffect(() => {
    setQa([]);
    setQuestion("");
    setPending(false);
  }, [currentReport?.id]);

  function startNew() {
    timers.current.forEach(clearTimeout);
    setView("flow");
    setOpenReportId(null);
    setLiveReport(null);
    setObjective("");
    setStep(1);
    setCompleted(0);
    setAgentIndex(0);
    setEdits({});
  }

  function handleStart(text) {
    setObjective(text);
    setLiveReport(buildLiveReport(text));
    setAgentIndex(0);
    setCompleted(1);
    setStep(2);
  }

  function approveAgent() {
    if (agentIndex < AGENTS.length - 1) {
      setAgentIndex((n) => n + 1);
    } else {
      setCompleted(2);
      setStep(3);
    }
  }

  function continueToReport() {
    setHistory((prev) => (prev.some((r) => r.id === "rpt-live") ? prev : [liveReport, ...prev]));
    setCompleted(4);
    setStep(4);
  }

  function openFromHistory(id) {
    timers.current.forEach(clearTimeout);
    setView("history");
    setOpenReportId(id);
  }

  function jumpStep(n) {
    if (view !== "flow") return;
    if (n <= Math.max(completed + 1, step)) setStep(n);
  }

  function handleAsk(text) {
    if (!currentReport) return;
    setQa((t) => [...t, { role: "user", text }]);
    setQuestion("");
    setPending(true);
    setTimeout(() => {
      setQa((t) => [...t, { role: "agent", text: answerQuestion(text, currentReport.title) }]);
      setPending(false);
    }, 650);
  }

  // Dock configuration
  const lifted = view === "flow" && step === 1;
  const showThinking = view === "flow" && (step === 2 || step === 3);
  const composerMode = lifted ? "hero" : "chat";
  const chatDisabled = view === "flow" && step !== 4; // chat only active on the final report / history
  const agent = AGENTS[agentIndex];

  const thinkingTitle =
    step === 3
      ? "Analytics ready for review"
      : `${agent.name} ${ready ? "is waiting for your approval" : "is thinking"}`;
  const thinkingDetail =
    step === 3
      ? "Review the charts, then generate the report."
      : ready
        ? "Approve to continue to the next agent."
        : (edits[`${agent.id}-t-${Math.max(revealed - 1, 0)}`] ?? agent.thoughts[Math.max(revealed - 1, 0)]);

  return (
    <div className="flex">
      <Sidebar
        history={history}
        activeReportId={viewingHistory ? openReportId : null}
        userName={USER_NAME}
        onNew={startNew}
        onOpen={openFromHistory}
      />

      <main className="relative h-screen flex-1 overflow-hidden">
        {/* Scrollable content */}
        <div className="h-full overflow-y-auto px-6 pt-10 sm:px-10" style={{ paddingBottom: lifted ? "2.5rem" : "11rem" }}>
          {viewingHistory && currentReport ? (
            <div>
              <button
                type="button"
                onClick={startNew}
                className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <span aria-hidden>←</span> New analysis
              </button>
              <Step4Report report={currentReport} qa={qa} pending={pending} />
            </div>
          ) : (
            <>
              {step > 1 && <StepRail current={step} completed={completed} onJump={jumpStep} />}
              {step === 1 && <Step1Discovery greeting={greeting} />}
              {step === 2 && (
                <Step2Thinking
                  index={agentIndex}
                  revealed={revealed}
                  ready={ready}
                  edits={edits}
                  onEdit={(k, v) => setEdits((p) => ({ ...p, [k]: v }))}
                  onApprove={approveAgent}
                  onCancel={startNew}
                />
              )}
              {step === 3 && <Step3Analytics onContinue={continueToReport} onBack={() => setStep(2)} />}
              {step === 4 && liveReport && <Step4Report report={liveReport} qa={qa} pending={pending} />}
            </>
          )}
        </div>

        {/* Persistent composer dock — slides between centered (Step 1) and bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-6 transition-transform duration-700 ease-out sm:px-10"
          style={{ transform: lifted ? "translateY(-42vh)" : "translateY(0)" }}
        >
          <div className="pointer-events-auto mx-auto max-w-reading">
            {showThinking && <ThinkingStream title={thinkingTitle} detail={thinkingDetail} />}
            <Composer
              mode={composerMode}
              value={composerMode === "hero" ? prompt : question}
              onChange={composerMode === "hero" ? setPrompt : setQuestion}
              onSubmit={composerMode === "hero" ? handleStart : handleAsk}
              disabled={composerMode !== "hero" && chatDisabled}
              placeholder={
                composerMode === "hero"
                  ? "Message the Tech Care analyst…"
                  : chatDisabled
                    ? "Agents are working…"
                    : "Ask a follow-up about this report…"
              }
              buttonLabel={composerMode === "hero" ? "Start" : "Ask"}
            />

            {lifted && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setPrompt(s.prompt)}
                    className="rounded-full bg-white px-3.5 py-1.5 text-[13px] text-ink-soft ring-1 ring-black/[0.05] transition-colors hover:text-ink hover:ring-black/10"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
