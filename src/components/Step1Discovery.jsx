import AmbientBlob from "./AmbientBlob.jsx";

// Step 1 content — greeting + ambient aura. The composer and suggestion chips
// live in the persistent dock (rendered by App) so they can slide to the bottom.
export default function Step1Discovery({ greeting }) {
  return (
    <div className="relative mx-auto flex max-w-reading flex-col items-center pt-[14vh] text-center">
      {/* Layer 1: crisp geometric icon */}
      <div className="relative mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-black/15 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        {/* Layer 2: fluid aura directly under icon */}
        <AmbientBlob mode="idle" className="absolute -inset-4 opacity-85" />

        <svg viewBox="0 0 24 24" className="relative h-8 w-8" aria-label="Tech Care mark">
          <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="none" stroke="#23211d" strokeWidth="1.8" />
          <path d="M7 8h10" stroke="#23211d" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 8v8" stroke="#23211d" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 16.2a3.2 3.2 0 1 1 0-6.4" stroke="#23211d" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <h1 className="relative text-[30px] font-semibold tracking-tight text-ink">{greeting}</h1>
      <p className="relative mt-2 text-[15px] text-ink-muted">
        Describe what to analyze and the squad will take it from here.
      </p>
    </div>
  );
}
