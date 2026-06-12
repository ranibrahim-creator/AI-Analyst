// Linear step indicator. No green, no boxes — a thin baseline with a
// microscopic noon-yellow dot marking the active step, and a subtle
// line accent under completed/active labels.

const STEPS = [
  { n: 1, label: "Discovery" },
  { n: 2, label: "Agent thinking" },
  { n: 3, label: "Analytics" },
  { n: 4, label: "Report" },
];

export default function StepRail({ current, completed, onJump }) {
  return (
    <nav aria-label="Analysis steps" className="mb-10">
      <ol className="flex flex-wrap items-center gap-x-7 gap-y-2">
        {STEPS.map((step) => {
          const isActive = step.n === current;
          const isDone = completed >= step.n && step.n !== current;
          const reachable = step.n <= Math.max(completed + 1, current);
          return (
            <li key={step.n}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump?.(step.n)}
                className={`group flex items-center gap-2 pb-1.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-ink"
                    : isDone
                      ? "text-ink-soft hover:text-ink"
                      : "text-ink-faint"
                } ${reachable ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full transition-all ${
                    isActive
                      ? "bg-noon"
                      : isDone
                        ? "bg-ink-faint group-hover:bg-ink-muted"
                        : "bg-transparent ring-1 ring-inset ring-ink-faint/60"
                  }`}
                />
                <span className="tabular-nums text-ink-faint">{step.n}</span>
                <span>{step.label}</span>
                <span
                  className={`block h-px w-6 origin-left transition-transform ${
                    isActive ? "scale-x-100 bg-ink" : "scale-x-0 bg-transparent"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
