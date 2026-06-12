import AmbientBlob from "./AmbientBlob.jsx";

// Official yellow Noon mark — no box, Notion-scale sizing. Hover morphs into a winking face.
export default function NoonBrandLogo({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[72px] w-[72px]" : "h-9 w-9";

  return (
    <div className={`group relative inline-flex items-center justify-center ${className}`} aria-label="noon">
      {size === "hero" && <AmbientBlob mode="idle" className="absolute -inset-8 opacity-80" />}

      <svg viewBox="0 0 80 80" className={`relative ${dim}`} aria-hidden>
        {/* Base yellow Noon glyph */}
        <g className="noon-logo-base transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-95">
          <path
            d="M40 8 C22 8 10 22 10 40 C10 58 22 72 40 72 C52 72 62 64 68 52"
            fill="none"
            stroke="#FEEE00"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <rect x="18" y="14" width="16" height="10" rx="2" transform="rotate(-28 26 19)" fill="#FEEE00" />
        </g>

        {/* Winking AI face */}
        <g className="noon-logo-wink opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
          <circle cx="40" cy="40" r="30" fill="#FEEE00" opacity="0.18" />
          <circle cx="28" cy="36" r="4.5" fill="#23211d" />
          <path
            d="M48 34 q6 8 12 0"
            fill="none"
            stroke="#23211d"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M24 50 q16 14 32 0"
            fill="none"
            stroke="#23211d"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
