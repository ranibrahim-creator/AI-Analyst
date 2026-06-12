// Horizontal stepper — circles, connecting line, label + caption per step.

const STEPS = [
  { n: 1, label: "Discovery", caption: "Set objective" },
  { n: 2, label: "Thinking", caption: "Agent pipeline" },
  { n: 3, label: "Analytics", caption: "Validate signal" },
  { n: 4, label: "Report", caption: "Final brief" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
      <path
        d="M2.5 6l2.2 2.2L9.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StepRail({ current, completed, onJump }) {
  return (
    <nav aria-label="Analysis steps" className="mb-12">
      <ol className="relative flex items-start justify-between">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[14px] h-px bg-black/[0.08]"
          aria-hidden
        />

        {STEPS.map((step) => {
          const isActive = step.n === current;
          const isDone = completed >= step.n && step.n !== current;
          const reachable = step.n <= Math.max(completed + 1, current);

          return (
            <li key={step.n} className="relative z-[1] flex flex-1 flex-col items-center">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump?.(step.n)}
                className={`flex flex-col items-center gap-2 transition-opacity ${
                  reachable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors ${
                    isDone
                      ? "bg-ink text-white"
                      : isActive
                        ? "bg-ink text-white ring-4 ring-ink/10"
                        : "bg-white text-ink-faint ring-1 ring-black/[0.12]"
                  }`}
                >
                  {isDone ? <CheckIcon /> : step.n}
                </span>
                <span className="text-center">
                  <span
                    className={`block text-[12px] font-semibold leading-tight ${
                      isActive || isDone ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-ink-muted">{step.caption}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
