import AmbientBlob from "./AmbientBlob.jsx";

// Arabic noon (ن) — bowl + diamond. Hover morphs the same shapes into a winking face.
export default function NoonBrandLogo({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";

  return (
    <div className={`noon-logo group relative inline-flex items-center justify-center ${className}`} aria-label="noon">
      {size === "hero" && <AmbientBlob mode="idle" className="absolute -inset-8 opacity-80" />}

      <svg viewBox="0 0 80 80" className={`relative ${dim}`} aria-hidden>
        <g className="noon-glyph origin-[40px_44px]">
          {/* Bowl — thick arc, flat right end, slanted left end */}
          <path
            d="M 18 44 L 22.5 39.5 C 22.5 28, 57.5 28, 57.5 39.5 L 57.5 44 C 57.5 33, 22.5 33, 22.5 44 Z"
            className="noon-bowl fill-[#23211d] transition-all duration-[550ms] ease-in-out group-hover:translate-y-[10px] group-hover:scale-[0.62] group-hover:fill-[#FEEE00]"
          />

          {/* Diamond dot → left eye on hover */}
          <path
            d="M 34 21 L 42.5 17 L 47 24.5 L 38.5 28.5 Z"
            className="noon-dot fill-[#23211d] transition-all duration-[550ms] ease-in-out group-hover:translate-x-[-5px] group-hover:translate-y-[14px] group-hover:scale-[0.45] group-hover:fill-[#FEEE00]"
          />

          {/* Wink — draws in on hover */}
          <path
            d="M 46 35 Q 52 39 58 35"
            fill="none"
            stroke="#FEEE00"
            strokeWidth="4.5"
            strokeLinecap="round"
            pathLength="1"
            className="noon-wink opacity-0 group-hover:opacity-100"
          />
        </g>
      </svg>
    </div>
  );
}
