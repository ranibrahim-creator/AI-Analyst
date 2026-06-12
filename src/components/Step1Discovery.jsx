import NoonBrandLogo from "./NoonBrandLogo.jsx";

// Step 1 content — Noon brand logo with wink hover, greeting, and ambient aura.
// The composer and suggestion chips live in the persistent dock (rendered by App).
export default function Step1Discovery({ greeting }) {
  return (
    <div className="relative mx-auto flex max-w-reading flex-col items-center pt-[14vh] text-center">
      <NoonBrandLogo className="mb-5" />

      <h1 className="relative text-[30px] font-semibold tracking-tight text-ink">{greeting}</h1>
      <p className="relative mt-2 text-[15px] text-ink-muted">
        Describe what to analyze and the squad will take it from here.
      </p>
    </div>
  );
}
