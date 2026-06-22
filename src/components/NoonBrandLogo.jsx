import AmbientBlob from "./AmbientBlob.jsx";

// Arabic noon (ن) — yellow bowl + diamond. Hover morphs into a winking face.
export default function NoonBrandLogo({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";

  return (
    <div className={`noon-logo group relative inline-flex items-center justify-center ${className}`} aria-label="noon">
      {size === "hero" && <AmbientBlob mode="idle" className="absolute -inset-8 opacity-80" />}

      <svg viewBox="0 0 80 80" className={`relative ${dim}`} aria-hidden>
        <g className="noon-glyph origin-[40px_44px]">
          {/* Bowl → smile on hover */}
          <path
            d="M 18 44 L 22.5 39.5 C 22.5 28, 57.5 28, 57.5 39.5 L 57.5 44 C 57.5 33, 22.5 33, 22.5 44 Z"
            className="noon-bowl fill-noon transition-all duration-[550ms] ease-in-out group-hover:translate-y-[11px] group-hover:scale-[0.58] group-hover:fill-ink"
          />

          {/* Diamond dot → left eye on hover */}
          <path
            d="M 34 21 L 42.5 17 L 47 24.5 L 38.5 28.5 Z"
            className="noon-dot fill-noon transition-all duration-[550ms] ease-in-out group-hover:translate-x-[-6px] group-hover:translate-y-[15px] group-hover:scale-[0.42]"
          />

          {/* Wink — draws in on hover */}
          <path
            d="M 46 35 Q 52 39 58 35"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            pathLength="1"
            className="noon-wink text-ink opacity-0 group-hover:opacity-100"
          />
        </g>
      </svg>
    </div>
  );
}
