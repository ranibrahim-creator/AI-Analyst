import { useEffect, useRef, useState } from "react";

function SearchIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function FlipSearch({
  value,
  onChange,
  label = "History",
  placeholder = "Search reports…",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  function openSearch() {
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 260);
  }

  function forceClose() {
    setOpen(false);
    inputRef.current?.blur();
  }

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        if (value.trim()) {
          onChange("");
          inputRef.current?.focus();
          return;
        }
        forceClose();
      }
    }

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        if (value.trim()) return;
        forceClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, value, onChange]);

  return (
    <div ref={rootRef} className="relative flex h-7 items-center">
      <span
        className={`shrink-0 text-[11px] font-medium text-ink-muted transition-all duration-500 ease-elastic ${
          open ? "mr-0 w-0 overflow-hidden opacity-0" : "mr-auto opacity-100"
        }`}
      >
        {label}
      </span>

      <div
        className={`flip-search-shell relative h-7 shrink-0 transition-[width] duration-500 ease-elastic ${
          open ? "ml-0 w-full" : "ml-auto w-7"
        }`}
      >
        <div
          className={`flip-search-perspective h-full w-full ${open ? "" : "flip-search-shell--idle"}`}
        >
          <div
            className={`flip-search-card relative h-full w-full transition-transform duration-500 ease-elastic [transform-style:preserve-3d] ${
              open ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front — trigger face */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              aria-expanded={open}
              className="flip-search-face absolute inset-0 grid place-items-center rounded-md text-ink-faint transition-colors [backface-visibility:hidden] hover:bg-[var(--hover-subtle)] hover:text-ink-muted"
            >
              <SearchIcon />
            </button>

            {/* Back — active search input */}
            <div className="flip-search-face absolute inset-0 flex items-center gap-1 rounded-md bg-[var(--hover-subtle)] px-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="shrink-0 text-ink-muted">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                data-history-search
                className="h-full min-w-0 flex-1 bg-transparent text-[11px] text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  aria-label="Clear search"
                  className="grid h-4 w-4 shrink-0 place-items-center text-ink-faint transition-colors hover:text-ink-muted"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                    <path
                      d="M4.5 4.5l7 7M11.5 4.5l-7 7"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
