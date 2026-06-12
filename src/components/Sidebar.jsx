import { useMemo, useRef, useState } from "react";

function SearchIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-ink-muted" aria-hidden>
      <path
        d="M8 1.5l1 3.5L12.5 6 9 7l-1 3.5L7 7 3.5 6 7 5zM12 10l.6 1.8L14.5 12.5l-1.9.7-.6 1.8-.6-1.8-1.9-.7 1.9-.7z"
        fill="currentColor"
      />
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

function HistorySearch({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  function expand() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div
      className="group/history-search relative flex items-center"
      onMouseEnter={expand}
      onMouseLeave={() => {
        if (!value.trim()) setOpen(false);
      }}
    >
      <span className="text-[11px] font-medium text-ink-muted">History</span>

      <div
        className={`ml-auto flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "w-full max-w-[168px]" : "w-5"
        }`}
      >
        <span
          className={`shrink-0 text-ink-faint transition-opacity ${open ? "mr-1.5 opacity-100" : "opacity-70"}`}
        >
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={expand}
          onBlur={() => {
            if (!value.trim()) setOpen(false);
          }}
          placeholder="Search reports…"
          data-history-search
          className={`h-6 w-full bg-transparent text-[11px] text-ink outline-none placeholder:text-ink-faint transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      </div>
    </div>
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
        collapsed ? "w-0 border-r-0" : "w-[248px]"
      }`}
    >
      <div className={`flex h-full min-w-[248px] flex-col px-2 py-2 ${collapsed ? "invisible" : ""}`}>
        {/* Collapse toggle */}
        <div className="flex justify-end px-1 pb-1">
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

        {/* Notion-style New analysis pill */}
        <button
          type="button"
          onClick={onNew}
          className="mx-1 inline-flex w-[calc(100%-8px)] items-center justify-center gap-2 rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[13px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.02]"
        >
          <SparkleIcon />
          New analysis
        </button>

        {/* History */}
        <div className="mt-3 flex min-h-0 flex-1 flex-col px-1">
          <div className="mb-1 px-1">
            <HistorySearch value={query} onChange={setQuery} />
          </div>

          <div className="flex-1 space-y-px overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-1.5 py-2 text-[11px] text-ink-faint">No matching reports</p>
            ) : (
              filtered.map((report) => {
                const active = report.id === activeReportId;
                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => onOpen(report.id)}
                    className={`flex w-full items-center gap-1.5 rounded-md px-2 py-[5px] text-left text-[12px] leading-[1.2] transition-colors ${
                      active ? "bg-black/[0.06] text-ink" : "text-ink-soft hover:bg-black/[0.04] hover:text-ink"
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

        {/* Profile — Tech Care lives here subtly */}
        <div className="mt-auto flex items-center gap-2 border-t border-black/[0.06] px-2 py-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[12px] font-medium leading-tight text-ink">{userName}</div>
            <div className="truncate text-[10px] leading-tight text-ink-muted">Tech Care</div>
          </div>
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
