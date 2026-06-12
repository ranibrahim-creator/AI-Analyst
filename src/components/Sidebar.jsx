// Notion-leaning sidebar: matte gray column, compact history tree,
// uniform neutral status dots, and a clean bottom profile row.

function NoonLogo() {
  // Clean vector "noon" wordmark with the signature smile under the middle.
  return (
    <svg viewBox="0 0 132 44" className="h-6 w-auto" role="img" aria-label="noon">
      <text
        x="0"
        y="32"
        fontFamily="Inter, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1.5"
        fill="#23211d"
      >
        noon
      </text>
      <path
        d="M40 36 q24 12 48 0"
        fill="none"
        stroke="#FEEE00"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Sidebar({ history, activeReportId, userName, onNew, onOpen }) {
  return (
    <aside className="flex h-screen w-[274px] shrink-0 flex-col border-r border-black/[0.08] bg-[#f4f4f2] px-3 py-3">
      {/* Branding */}
      <div className="flex items-baseline gap-2 px-2 py-1">
        <NoonLogo />
        <span className="text-[11px] font-medium text-ink-muted">Tech Care</span>
      </div>

      {/* Notion-like primary action button */}
      <button
        type="button"
        onClick={onNew}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-black/[0.16] bg-white px-3 py-2 text-[13px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:bg-black/[0.02]"
      >
        <span className="grid h-4 w-4 place-items-center rounded-[4px] bg-ink text-[12px] font-semibold text-white">+</span>
        New analysis
      </button>

      {/* History logs */}
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1">
        <div className="px-2 pb-0.5 text-[11px] font-medium text-ink-muted">History</div>
        <div className="flex-1 space-y-0.5 overflow-y-auto">
          {history.map((report) => {
            const active = report.id === activeReportId;
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => onOpen(report.id)}
                className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] leading-[1.2] transition-colors ${
                  active ? "bg-black/[0.06] text-ink" : "text-ink-soft hover:bg-black/[0.035] hover:text-ink"
                }`}
              >
                <span data-history-dot className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-muted" />
                <span className="truncate">{report.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User profile */}
      <div className="mt-auto flex items-center gap-2.5 px-2 py-1">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">
          {userName.slice(0, 1).toUpperCase()}
        </span>
        <div className="text-[13px] font-medium leading-tight text-ink">{userName}</div>
      </div>
    </aside>
  );
}
