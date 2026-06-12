// Borderless sidebar: noon wordmark, a primary "New analysis" button,
// historical report logs with solid status dots, and the user profile.

const STATUS_DOT = {
  New: "bg-noon",
  Payments: "bg-[#3276ff]",
  Onboarding: "bg-ink",
  Fulfillment: "bg-ink-muted",
};

function NoonLogo() {
  // Clean vector "noon" wordmark with the signature smile under the middle.
  return (
    <svg viewBox="0 0 132 44" className="h-7 w-auto" role="img" aria-label="noon">
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
    <aside className="flex h-screen w-72 shrink-0 flex-col gap-6 px-4 py-6">
      {/* Branding */}
      <div className="flex items-baseline gap-2 px-2">
        <NoonLogo />
        <span className="text-[12px] font-medium text-ink-muted">Tech Care</span>
      </div>

      {/* Primary action button */}
      <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <span className="text-noon">+</span> New analysis
      </button>

      {/* History logs */}
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <div className="px-2 pb-1 text-[12px] font-medium text-ink-muted">History</div>
        <div className="flex-1 space-y-0.5 overflow-y-auto">
          {history.map((report) => {
            const active = report.id === activeReportId;
            const dot = STATUS_DOT[report.tag] || "bg-ink-muted";
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => onOpen(report.id)}
                className={`group flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] transition-colors ${
                  active ? "bg-black/[0.05] text-ink" : "text-ink-soft hover:bg-black/[0.03] hover:text-ink"
                }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${active ? "bg-noon" : dot}`} />
                <span className="truncate">{report.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3 px-2 pt-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">
          {userName.slice(0, 1).toUpperCase()}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-medium text-ink">{userName}</div>
          <div className="text-[11px] text-ink-muted">Tech Care squad</div>
        </div>
      </div>
    </aside>
  );
}
