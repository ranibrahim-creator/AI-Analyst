import AmbientBlob from "./AmbientBlob.jsx";

// Yellow stroke Noon mark → on hover morphs into a minimalist winking face.
export default function NoonBrandLogo({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";
  const sw = size === "hero" ? 6 : 3.5;
  const eye = size === "hero" ? 4.5 : 2.8;

  return (
    <div className={`noon-logo group relative inline-flex items-center justify-center ${className}`} aria-label="noon">
      {size === "hero" && <AmbientBlob mode="idle" className="absolute -inset-8 opacity-80" />}

      <svg viewBox="0 0 80 80" className={`relative ${dim}`} aria-hidden>
        <g fill="none" stroke="#FEEE00" strokeLinecap="round" strokeLinejoin="round">
          {/* ── Idle: noon glyph (arc + top tick) ── */}
          <g className="noon-idle transition-all duration-[600ms] ease-in-out group-hover:scale-[0.88] group-hover:opacity-0">
            <path
              d="M50 20 A28 28 0 1 0 50 60"
              strokeWidth={sw}
              className="origin-[40px_40px] transition-transform duration-[600ms] ease-in-out group-hover:translate-y-[10px] group-hover:rotate-[8deg]"
            />
            <path
              d="M24 28 L31 21"
              strokeWidth={sw}
              className="origin-[27px_24px] transition-transform duration-[600ms] ease-in-out group-hover:translate-x-[1px] group-hover:translate-y-[6px] group-hover:rotate-[12deg]"
            />
          </g>

          {/* ── Hover: winking face (same yellow line weight) ── */}
          <g className="noon-face opacity-0 transition-opacity duration-[600ms] ease-in-out group-hover:opacity-100">
            {/* Left eye */}
            <path
              d="M27 33 V39"
              strokeWidth={eye}
              pathLength="1"
              className="noon-eye-draw"
              style={{ animationDelay: "80ms" }}
            />
            {/* Winking right eye */}
            <path
              d="M44 34 Q50 38 56 34"
              strokeWidth={eye}
              pathLength="1"
              className="noon-eye-draw"
              style={{ animationDelay: "160ms" }}
            />
            {/* Smile — arc settles into mouth */}
            <path
              d="M22 51 Q40 63 58 51"
              strokeWidth={sw - 0.5}
              pathLength="1"
              className="noon-smile-draw"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
