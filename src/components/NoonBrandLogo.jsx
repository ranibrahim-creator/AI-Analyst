import AmbientBlob from "./AmbientBlob.jsx";

// Official minimalist Noon wordmark with ambient aura. On hover the mark
// morphs into a stylized AI winking face via cross-fade + path animation.
export default function NoonBrandLogo({ className = "" }) {
  return (
    <div
      className={`group relative grid h-16 w-16 place-items-center rounded-2xl border border-black/15 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] ${className}`}
      aria-label="noon"
    >
      <AmbientBlob mode="idle" className="absolute -inset-4 opacity-85" />

      <svg viewBox="0 0 64 64" className="relative h-10 w-10" aria-hidden>
        {/* Base Noon mark — fades out on hover */}
        <g className="noon-logo-base transition-opacity duration-500 ease-in-out group-hover:opacity-0">
          <text
            x="4"
            y="38"
            fontFamily="Inter, sans-serif"
            fontSize="26"
            fontWeight="700"
            letterSpacing="-1.2"
            fill="#23211d"
          >
            n
          </text>
          <circle cx="32" cy="34" r="3.2" fill="#23211d" />
          <text
            x="38"
            y="38"
            fontFamily="Inter, sans-serif"
            fontSize="26"
            fontWeight="700"
            letterSpacing="-1.2"
            fill="#23211d"
          >
            n
          </text>
          <path
            d="M14 44 q18 10 36 0"
            fill="none"
            stroke="#FEEE00"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Winking face — fades in on hover */}
        <g className="noon-logo-wink opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
          <circle cx="22" cy="28" r="3.2" fill="#23211d" />
          <path
            d="M40 26 q4 6 8 0"
            fill="none"
            stroke="#23211d"
            strokeWidth="2.8"
            strokeLinecap="round"
            className="origin-[44px_28px] transition-transform duration-500 ease-in-out group-hover:-rotate-12"
          />
          <path
            d="M18 42 q14 12 28 0"
            fill="none"
            stroke="#FEEE00"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out group-hover:translate-y-0.5"
          />
        </g>
      </svg>
    </div>
  );
}
