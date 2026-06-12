// Borderless sidebar. Holds only the squad identity ("Tech Care") and the
// historical report logs. No "Analytics" entry.

export default function Sidebar({ history, activeReportId, onNew, onOpen }) {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col gap-6 px-4 py-6">
      {/* Squad identity */}
      <div className="flex items-center gap-3 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-noon text-[17px] font-bold text-ink">
          n
        </span>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-ink">Tech Care</div>
          <div className="text-[12px] text-ink-muted">noon · CS analyst squad</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNew}
        className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-[14px] font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
      >
        <span className="text-noon">+</span> New analysis
      </button>

      {/* History logs */}
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <div className="px-2 pb-1 text-[12px] font-medium text-ink-muted">History</div>
        <div className="flex-1 space-y-0.5 overflow-y-auto">
          {history.map((report) => {
            const active = report.id === activeReportId;
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => onOpen(report.id)}
                className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] transition-colors ${
                  active ? "bg-black/[0.05] text-ink" : "text-ink-soft hover:bg-black/[0.03] hover:text-ink"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    active ? "bg-noon" : "bg-transparent ring-1 ring-inset ring-ink-faint/50 group-hover:bg-ink-faint"
                  }`}
                />
                <span className="truncate">{report.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer identity */}
      <div className="flex items-center gap-3 px-2 pt-2 text-[12px] text-ink-muted">
        <span className="h-7 w-7 rounded-full bg-gradient-to-br from-noon to-[#c9bb00]" />
        <div className="leading-tight">
          <div className="font-medium text-ink-soft">Tech Care squad</div>
          <div>4-agent pipeline</div>
        </div>
      </div>
    </aside>
  );
}
