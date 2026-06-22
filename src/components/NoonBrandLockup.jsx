// Official noon lockup — yellow glyph + نون / noon wordmark for navigation.
export default function NoonBrandLockup({ compact = false }) {
  const markSize = compact ? "h-7 w-7" : "h-9 w-9";

  return (
    <div
      className={`noon-lockup group flex min-w-0 items-center gap-2 ${compact ? "gap-1.5" : ""}`}
      aria-label="noon AI Analyst"
    >
      <svg viewBox="0 0 40 40" className={`noon-lockup-mark shrink-0 ${markSize}`} aria-hidden>
        {/* Draw-in arc stroke */}
        <path
          d="M 9 22 C 9 14, 31 14, 31 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          pathLength="1"
          className="noon-draw-arc text-noon"
        />
        {/* Bowl fill */}
        <path
          d="M 9 22 L 11.25 19.75 C 11.25 14, 28.75 14, 28.75 19.75 L 28.75 22 C 28.75 16.5, 11.25 16.5, 11.25 22 Z"
          className="noon-draw-fill fill-noon opacity-0"
        />
        {/* Diamond dot */}
        <path
          d="M 17 10.5 L 21.25 8.5 L 23.5 12.25 L 19.25 14.25 Z"
          className="noon-draw-dot fill-noon opacity-0"
        />
      </svg>

      <div className={`min-w-0 leading-none ${compact ? "truncate" : ""}`}>
        {!compact && (
          <div className="noon-lockup-arabic text-[10px] font-bold leading-none text-ink opacity-0">نون</div>
        )}
        <div
          className={`noon-lockup-word font-bold tracking-tight text-ink opacity-0 ${
            compact ? "text-[12px] leading-tight" : "text-[13px] leading-tight"
          }`}
        >
          noon
        </div>
        {!compact && (
          <div className="noon-lockup-sub mt-0.5 text-[10px] leading-tight text-ink-muted opacity-0">
            AI Analyst · Tech Care
          </div>
        )}
      </div>
    </div>
  );
}
