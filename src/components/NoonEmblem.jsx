// noon emblem — refined proportions + hover winky-face reveal in brand yellow.
export default function NoonEmblem({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";

  return (
    <div
      className={`noon-emblem group inline-flex cursor-default items-center justify-center text-[#000000] transition-colors duration-300 hover:text-[#FFE600] dark:text-[#f5f5f5] dark:hover:text-[#FFE600] ${className}`}
      aria-label="noon"
    >
      <svg viewBox="0 0 80 80" className={dim} aria-hidden>
        {/* Bowl + dot — outer R34 / inner R26, gap 337°→293° */}
        <g fill="currentColor">
          <path d="M 26.72 22.7 A 34 34 0 1 1 8.7 40.71 L 16.07 43.84 A 26 26 0 1 0 29.83 30.06 Z" />
          <path d="M 26.5 8.5 L 35.8 5.2 L 40.2 12.8 L 30.9 16 Z" />
        </g>

        {/* Winky face — fades in inside the hollow on hover */}
        <g
          fill="currentColor"
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <circle cx="32" cy="50" r="3" />
        </g>
        <g
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <path d="M 43 49.5 Q 47 45.5 51 49.5" />
          <path d="M 31 58 Q 40 64 49 58" />
        </g>
      </svg>
    </div>
  );
}
