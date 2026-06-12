import AmbientBlob from "./AmbientBlob.jsx";

// Step 1 content — greeting + ambient aura. The composer and suggestion chips
// live in the persistent dock (rendered by App) so they can slide to the bottom.
export default function Step1Discovery({ greeting }) {
  return (
    <div className="relative mx-auto flex max-w-reading flex-col items-center pt-[14vh] text-center">
      <div className="pointer-events-none absolute -top-2 h-52 w-52 opacity-90">
        <AmbientBlob mode="idle" className="h-full w-full" />
      </div>
      <h1 className="relative text-[30px] font-semibold tracking-tight text-ink">{greeting}</h1>
      <p className="relative mt-2 text-[15px] text-ink-muted">
        Describe what to analyze and the squad will take it from here.
      </p>
    </div>
  );
}
