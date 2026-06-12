import { useMemo, useState } from "react";

function NoonLogo() {
  return (
    <svg viewBox="0 0 132 44" className="h-[22px] w-auto" role="img" aria-label="noon">
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ink-faint" aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PanelToggleIcon({ collapsed }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-ink-muted" aria-hidden>
      {collapsed ? (
        <>
          <rect x="1.5" y="2" width="13" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.5 2v12" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8.5 8l2-1.5v3L8.5 8z" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="1.5" y="2" width="13" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.5 2v12" stroke="currentColor" strokeWidth="1.3" />
          <path d="M7.5 8l-2-1.5v3L7.5 8z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

export default function Sidebar({
  history,
  activeReportId,
  userName,
  collapsed,
  onToggleCollapse,
  onNew,
  onOpen,
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((r) => r.title.toLowerCase().includes(q));
  }, [history, query]);

  return (
    <aside
      data-sidebar
      className={`flex h-screen shrink-0 flex-col overflow-hidden border-r border-black/[0.08] bg-[#f4f4f2] transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-0 border-r-0" : "w-[260px]"
      }`}
    >
      <div className={`flex h-full min-w-[260px] flex-col px-2.5 py-2.5 ${collapsed ? "invisible" : ""}`}>
        {/* Header row: branding + collapse toggle */}
        <div className="flex items-center justify-between px-1.5 py-0.5">
          <div className="flex items-baseline gap-1.5">
            <NoonLogo />
            <span className="text-[10px] font-medium text-ink-muted">Tech Care</span>
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            data-sidebar-toggle
            aria-label="Collapse sidebar"
            className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-black/[0.05]"
          >
            <PanelToggleIcon collapsed={false} />
          </button>
        </div>

        <button
          type="button"
          onClick={onNew}
          className="mt-1.5 inline-flex items-center justify-center gap-1.5 rounded-md border border-black/[0.14] bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-black/[0.02]"
        >
          <span className="grid h-3.5 w-3.5 place-items-center rounded-[3px] bg-ink text-[10px] font-semibold text-white">
            +
          </span>
          New analysis
        </button>

        {/* History + search */}
        <div className="mt-2 flex min-h-0 flex-1 flex-col">
          <div className="px-1.5 pb-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-muted">History</div>

          <div className="relative mx-1.5 mb-1 mt-0.5">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports…"
              data-history-search
              className="h-7 w-full bg-transparent pl-7 pr-2 text-[11px] leading-none text-ink outline-none placeholder:text-ink-faint"
            />
          </div>

          <div className="flex-1 space-y-px overflow-y-auto px-0.5">
            {filtered.length === 0 ? (
              <p className="px-1.5 py-1 text-[11px] text-ink-faint">No matching reports</p>
            ) : (
              filtered.map((report) => {
                const active = report.id === activeReportId;
                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => onOpen(report.id)}
                    className={`group flex w-full items-center gap-1.5 rounded-[4px] px-1.5 py-[3px] text-left text-[11px] leading-[1.15] transition-colors ${
                      active ? "bg-black/[0.06] text-ink" : "text-ink-soft hover:bg-black/[0.035] hover:text-ink"
                    }`}
                  >
                    <span data-history-dot className="h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
                    <span className="truncate">{report.title}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 px-1.5 py-0.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <div className="text-[12px] font-medium leading-none text-ink">{userName}</div>
        </div>
      </div>
    </aside>
  );
}

export function SidebarExpandButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-sidebar-expand
      aria-label="Expand sidebar"
      className="absolute left-3 top-3 z-30 grid h-8 w-8 place-items-center rounded-md border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors hover:bg-black/[0.02]"
    >
      <PanelToggleIcon collapsed />
    </button>
  );
}
