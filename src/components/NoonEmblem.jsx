// Precise noon emblem — static 3/4 arc + tilted parallelogram dot.
export default function NoonEmblem({ className = "", size = "hero" }) {
  const dim = size === "hero" ? "h-[80px] w-[80px]" : "h-9 w-9";

  return (
    <div className={`inline-flex items-center justify-center text-ink ${className}`} aria-label="noon">
      <svg viewBox="0 0 80 80" className={dim} aria-hidden>
        <g fill="currentColor">
          <path
            d="
              M 40 21
              A 27 27 0 1 1 13 48
              L 24 48
              A 16 16 0 1 0 40 32
              Z
            "
          />
          <path
            d="
              M 27.5 11.5
              L 36.5 8.5
              L 40.5 15
              L 31.5 18
              Z
            "
          />
        </g>
      </svg>
    </div>
  );
}
