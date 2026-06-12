import AmbientBlob from "./AmbientBlob.jsx";

// Authentic Arabic noon (ن) glyph → hover reveals the winking face animation.
export default function NoonBrandLogo({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";
  const sw = size === "hero" ? 5.5 : 3.2;
  const eye = size === "hero" ? 4.5 : 2.8;

  return (
    <div className={`noon-logo group relative inline-flex items-center justify-center ${className}`} aria-label="noon">
      {size === "hero" && <AmbientBlob mode="idle" className="absolute -inset-8 opacity-80" />}

      <svg viewBox="0 0 80 80" className={`relative ${dim}`} aria-hidden>
        {/* ── Idle: official noon ن (bowl + diamond dot) ── */}
        <g
          className="noon-idle transition-all duration-[600ms] ease-in-out group-hover:scale-[0.9] group-hover:opacity-0"
          fill="#23211d"
        >
          {/* Bowl — thick arc, flat right end, slanted left end */}
          <path d="M 16.5 46.5 L 21 41.5 C 21 25.5, 59 25.5, 59 41.5 L 59 46.5 C 59 30.5, 21 30.5, 21 46.5 Z" />
          {/* Dot — tilted diamond above the opening */}
          <path d="M 33.5 19.5 L 43 15 L 47.5 23.5 L 38 28 Z" />
        </g>

        {/* ── Hover: winking face (yellow strokes) ── */}
        <g fill="none" stroke="#FEEE00" strokeLinecap="round" strokeLinejoin="round">
          <g className="noon-face opacity-0 transition-opacity duration-[600ms] ease-in-out group-hover:opacity-100">
            <path
              d="M27 33 V39"
              strokeWidth={eye}
              pathLength="1"
              className="noon-eye-draw"
              style={{ animationDelay: "80ms" }}
            />
            <path
              d="M44 34 Q50 38 56 34"
              strokeWidth={eye}
              pathLength="1"
              className="noon-eye-draw"
              style={{ animationDelay: "160ms" }}
            />
            <path
              d="M22 51 Q40 63 58 51"
              strokeWidth={sw}
              pathLength="1"
              className="noon-smile-draw"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
