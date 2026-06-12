import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar, { SidebarExpandButton } from "./components/Sidebar.jsx";
import StepRail from "./components/StepRail.jsx";
import Composer from "./components/Composer.jsx";
import Step1Discovery from "./components/Step1Discovery.jsx";
import Step2Thinking from "./components/Step2Thinking.jsx";
import Step3Analytics from "./components/Step3Analytics.jsx";
import Step4Report from "./components/Step4Report.jsx";
import UnsavedChangesModal from "./components/UnsavedChangesModal.jsx";
import { AGENTS, INITIAL_HISTORY, buildLiveReport, answerQuestion } from "./data/analyst.js";

const USER_NAME = "Rana";

const SUGGESTIONS = [
  {
    label: "Summarize support",
    prompt: "Summarize seller support conversations and surface the top operational friction points.",
    icon: "summary",
  },
  {
    label: "Find friction",
    prompt: "Find the contact drivers causing repeat tickets and recommend macros to reduce them.",
    icon: "friction",
  },
  {
    label: "Weekly digest",
    prompt: "Build a weekly digest of unresolved fulfillment and returns escalations by owner.",
    icon: "digest",
  },
  {
    label: "Onboarding review",
    prompt: "Analyze new seller onboarding tickets and explain where the journey breaks down.",
    icon: "onboarding",
  },
];

function followUpDirty(report, qa, question) {
  if (question.trim()) return true;
  const saved = report?.followUp ?? [];
  return JSON.stringify(qa) !== JSON.stringify(saved);
}

function readStoredTheme() {
  try {
    return localStorage.getItem("theme") === "dark";
  } catch {
    return false;
  }
}

export default function App() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(0);
  const [view, setView] = useState("flow");
  const [openReportId, setOpenReportId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(readStoredTheme);

  const [prompt, setPrompt] = useState(
    "Summarize seller support conversations, identify operational friction, and produce a leadership-ready report."
  );
  const [objective, setObjective] = useState("");
  const [liveReport, setLiveReport] = useState(null);

  const [agentIndex, setAgentIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [edits, setEdits] = useState({});
  const timers = useRef([]);
  const loadedReportId = useRef(null);
  const scrollRef = useRef(null);
  const [dockHidden, setDockHidden] = useState(false);

  const [pendingNav, setPendingNav] = useState(null);
  const [guardOpen, setGuardOpen] = useState(false);

  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState([]);
  const [pending, setPending] = useState(false);

  const viewingHistory = view === "history" && openReportId !== null;
  const baseReport = viewingHistory ? history.find((r) => r.id === openReportId) : liveReport;
  const currentReport = baseReport ?? null;

  const isLiveReportView = view === "flow" && step === 4 && liveReport;
  const canHaveFollowUp = viewingHistory || isLiveReportView;

  const hasUnsavedChanges = canHaveFollowUp && followUpDirty(baseReport, qa, question);

  const agent = AGENTS[agentIndex];
  const thinkingLines = useMemo(
    () => agent.thoughts.map((t, i) => edits[`${agent.id}-t-${i}`] ?? t),
    [agent, edits]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, [darkMode]);

  // Agent thinking timer — drives composer scroll + proposal reveal (no main-panel animation).
  useEffect(() => {
    if (view !== "flow" || step !== 2) return undefined;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setReady(false);
    timers.current.push(setTimeout(() => setReady(true), 450 * (agent.thoughts.length + 2)));
    return () => timers.current.forEach(clearTimeout);
  }, [step, agentIndex, view, agent.thoughts.length]);

  // Load follow-up thread only when switching to a different history report.
  useEffect(() => {
    if (!viewingHistory || !openReportId) {
      loadedReportId.current = null;
      return;
    }
    if (loadedReportId.current === openReportId) return;
    loadedReportId.current = openReportId;
    const report = history.find((r) => r.id === openReportId);
    setQa(report?.followUp ?? []);
    setQuestion("");
    setPending(false);
  }, [openReportId, viewingHistory, history]);

  function requestNavigation(action) {
    if (hasUnsavedChanges) {
      setPendingNav(() => action);
      setGuardOpen(true);
      return;
    }
    action();
  }

  function saveChanges() {
    const action = pendingNav;
    setPendingNav(null);
    setGuardOpen(false);

    if (viewingHistory && openReportId && baseReport) {
      const withFollowUp = { ...baseReport, followUp: qa };
      setHistory((prev) => prev.map((r) => (r.id === openReportId ? withFollowUp : r)));
    } else if (isLiveReportView && liveReport) {
      const withFollowUp = { ...liveReport, followUp: qa };
      setLiveReport(withFollowUp);
      setHistory((prev) => prev.map((r) => (r.id === "rpt-live" ? withFollowUp : r)));
    }

    action?.();
  }

  function discardChanges() {
    if (viewingHistory && openReportId) {
      setQa(baseReport?.followUp ?? []);
      setQuestion("");
    } else if (isLiveReportView) {
      setQa(liveReport?.followUp ?? []);
      setQuestion("");
    }

    const action = pendingNav;
    setPendingNav(null);
    setGuardOpen(false);
    action?.();
  }

  function handleLiveTitleEdit(value) {
    setLiveReport((prev) => (prev ? { ...prev, title: value } : prev));
    setHistory((prev) => prev.map((r) => (r.id === "rpt-live" ? { ...r, title: value } : r)));
  }

  function startNewImmediate() {
    timers.current.forEach(clearTimeout);
    setView("flow");
    setOpenReportId(null);
    setLiveReport(null);
    setObjective("");
    setStep(1);
    setCompleted(0);
    setAgentIndex(0);
    setEdits({});
    setReady(false);
  }

  function startNew() {
    requestNavigation(startNewImmediate);
  }

  function handleStart(text) {
    setObjective(text);
    setLiveReport(buildLiveReport(text));
    setAgentIndex(0);
    setCompleted(1);
    setStep(2);
    setReady(false);
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

  function openFromHistoryImmediate(id) {
    timers.current.forEach(clearTimeout);
    setView("history");
    setOpenReportId(id);
  }

  function openFromHistory(id) {
    if (id === openReportId && view === "history") return;
    requestNavigation(() => openFromHistoryImmediate(id));
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

  const showHome = view === "flow" && step === 1;

  let composerMode = "chat";
  let composerStatus = "Report agent is waiting for your approval. Approve to continue to the next agent.";

  if (view === "flow" && step === 1) {
    composerMode = "hero";
  } else if (view === "flow" && step === 2 && !ready) {
    composerMode = "thinking";
  } else if (view === "flow" && step === 2 && ready) {
    composerMode = "approval";
  } else if (view === "flow" && step === 3) {
    composerMode = "approval";
    composerStatus = "Review the analytics checkpoint, then generate the report.";
  }

  const chatEnabled = viewingHistory || (view === "flow" && step === 4);
  const isStatusDock = composerMode === "approval" || composerMode === "thinking";
  const hideStatusDock = isStatusDock && dockHidden;

  function handleMainScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setDockHidden(el.scrollTop > 40);
  }

  useEffect(() => {
    setDockHidden(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step, agentIndex, view, openReportId]);

  const mainPaddingBottom = showHome ? "2.5rem" : hideStatusDock ? "2.5rem" : "11rem";
  const dockTransform = hideStatusDock ? "translateY(12px)" : "translateY(0)";

  return (
    <div className={`flex h-screen overflow-hidden bg-app ${darkMode ? "dark" : ""}`}>
      <Sidebar
        history={history}
        activeReportId={viewingHistory ? openReportId : null}
        userName={USER_NAME}
        collapsed={sidebarCollapsed}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onToggleCollapse={() => setSidebarCollapsed(true)}
        onNew={startNew}
        onOpen={openFromHistory}
      />

      <main className="relative h-screen flex-1 overflow-hidden bg-main">
        {sidebarCollapsed && <SidebarExpandButton onClick={() => setSidebarCollapsed(false)} />}

        <div
          ref={scrollRef}
          onScroll={handleMainScroll}
          className="h-full overflow-y-auto px-6 pt-10 sm:px-10"
          style={{ paddingBottom: mainPaddingBottom }}
        >
          {viewingHistory && currentReport ? (
            <Step4Report report={currentReport} qa={qa} pending={pending} />
          ) : (
            <div key={`flow-step-${step}-agent-${agentIndex}`}>
              {step > 1 && <StepRail current={step} completed={completed} onJump={jumpStep} />}
              {step === 1 && (
                <Step1Discovery
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  onStart={handleStart}
                  suggestions={SUGGESTIONS}
                />
              )}
              {step === 2 && (
                <Step2Thinking
                  index={agentIndex}
                  ready={ready}
                  edits={edits}
                  onEdit={(k, v) => setEdits((p) => ({ ...p, [k]: v }))}
                  onApprove={approveAgent}
                  onCancel={startNew}
                />
              )}
              {step === 3 && <Step3Analytics onContinue={continueToReport} onBack={() => setStep(2)} />}
              {step === 4 && liveReport && (
                <Step4Report report={liveReport} qa={qa} pending={pending} onTitleEdit={handleLiveTitleEdit} />
              )}
            </div>
          )}
        </div>

        {!showHome && (
          <div
            data-composer-dock
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-6 transition-all duration-300 ease-out sm:px-10 ${
              hideStatusDock ? "opacity-0" : "opacity-100"
            }`}
            style={{ transform: dockTransform }}
          >
            <div className="pointer-events-auto mx-auto max-w-reading">
              <Composer
                mode={chatEnabled ? "chat" : composerMode}
                value={question}
                onChange={setQuestion}
                onSubmit={handleAsk}
                disabled={!chatEnabled && composerMode === "chat"}
                statusMessage={composerStatus}
                thinkingLines={thinkingLines}
                placeholder="Ask a follow-up about this report…"
                buttonLabel="Ask"
              />
            </div>
          </div>
        )}
      </main>

      <UnsavedChangesModal
        open={guardOpen}
        onSave={saveChanges}
        onDiscard={discardChanges}
        onCancel={() => {
          setGuardOpen(false);
          setPendingNav(null);
        }}
      />
    </div>
  );
}
