import AmbientBlob from "./AmbientBlob.jsx";

// Stroke-only yellow Noon mark. The same lines reposition into a winking face on hover.
export default function NoonBrandLogo({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";
  const sw = size === "hero" ? 5.5 : 3.5;

  return (
    <div className={`group relative inline-flex items-center justify-center ${className}`} aria-label="noon">
      {size === "hero" && <AmbientBlob mode="idle" className="absolute -inset-8 opacity-80" />}

      <svg viewBox="0 0 80 80" className={`relative ${dim}`} aria-hidden>
        <g fill="none" stroke="#FEEE00" strokeLinecap="round" strokeLinejoin="round">
          {/* Noon arc → smile */}
          <path
            d="M54 24 A26 26 0 1 0 54 56"
            strokeWidth={sw}
            className="origin-[40px_42px] transition-all duration-[550ms] ease-in-out group-hover:translate-y-[6px] group-hover:scale-[0.55]"
          />
          {/* Top tick → left eye */}
          <path
            d="M26 30 L33 23"
            strokeWidth={sw}
            className="origin-[30px_26px] transition-all duration-[550ms] ease-in-out group-hover:translate-x-[2px] group-hover:translate-y-[8px] group-hover:rotate-[75deg] group-hover:scale-[0.55]"
          />
          {/* Wink line — draws in on hover */}
          <path
            d="M48 36 H58"
            strokeWidth={sw - 0.5}
            pathLength="1"
            className="noon-wink-stroke opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
          />
        </g>
      </svg>
    </div>
  );
}
