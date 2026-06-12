import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import StepRail from "./components/StepRail.jsx";
import Step1Discovery from "./components/Step1Discovery.jsx";
import Step2Thinking from "./components/Step2Thinking.jsx";
import Step3Analytics from "./components/Step3Analytics.jsx";
import Step4Report from "./components/Step4Report.jsx";
import { INITIAL_HISTORY, buildLiveReport } from "./data/analyst.js";

function greetingText() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  return `Good ${part}, Tech Care`;
}

export default function App() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(0);
  const [objective, setObjective] = useState("");
  const [liveReport, setLiveReport] = useState(null);
  const [openReportId, setOpenReportId] = useState(null);
  const greeting = useMemo(greetingText, []);

  // openReportId !== null => viewing a saved report from history (read flow).
  const viewingHistory = openReportId !== null;
  const openedReport = viewingHistory
    ? history.find((r) => r.id === openReportId)
    : liveReport;

  function startNew() {
    setOpenReportId(null);
    setLiveReport(null);
    setObjective("");
    setStep(1);
    setCompleted(0);
  }

  function handleDiscovery(text) {
    setObjective(text);
    setLiveReport(buildLiveReport(text));
    setCompleted(1);
    setStep(2);
  }

  function handleThinkingDone() {
    setCompleted(2);
    setStep(3);
  }

  function handleAnalyticsContinue() {
    setCompleted(3);
    setStep(4);
    // Save the generated report to history once.
    setHistory((prev) =>
      prev.some((r) => r.id === "rpt-live") ? prev : [liveReport, ...prev]
    );
    setCompleted(4);
  }

  function openFromHistory(id) {
    setOpenReportId(id);
  }

  function jumpStep(n) {
    if (viewingHistory) return;
    if (n <= Math.max(completed + 1, step)) setStep(n);
  }

  function editLiveReport(next) {
    setLiveReport(next);
    setHistory((prev) => prev.map((r) => (r.id === next.id ? next : r)));
  }

  function editHistoryReport(next) {
    setHistory((prev) => prev.map((r) => (r.id === next.id ? next : r)));
  }

  return (
    <div className="flex">
      <Sidebar
        history={history}
        activeReportId={viewingHistory ? openReportId : null}
        onNew={startNew}
        onOpen={openFromHistory}
      />

      <main className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
          {viewingHistory && openedReport ? (
            <div>
              <button
                type="button"
                onClick={startNew}
                className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <span aria-hidden>←</span> New analysis
              </button>
              <Step4Report report={openedReport} onEdit={editHistoryReport} />
            </div>
          ) : (
            <>
              {step > 1 && (
                <StepRail current={step} completed={completed} onJump={jumpStep} />
              )}

              {step === 1 && (
                <Step1Discovery greeting={greeting} onSubmit={handleDiscovery} />
              )}
              {step === 2 && (
                <Step2Thinking
                  objective={liveReport || objective}
                  onComplete={handleThinkingDone}
                  onCancel={startNew}
                />
              )}
              {step === 3 && (
                <Step3Analytics
                  onContinue={handleAnalyticsContinue}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && liveReport && (
                <Step4Report report={liveReport} onEdit={editLiveReport} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
