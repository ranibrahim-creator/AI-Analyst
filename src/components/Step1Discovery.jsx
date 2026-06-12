import NoonBrandLogo from "./NoonBrandLogo.jsx";

export default function Step1Discovery({ greeting }) {
  return (
    <div className="relative mx-auto flex max-w-reading flex-col items-center pt-[12vh] text-center">
      <NoonBrandLogo size="hero" className="mb-6" />

      <h1 className="relative text-[32px] font-semibold tracking-tight text-ink">{greeting}</h1>
      <p className="relative mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">
        Describe what to analyze and the squad will take it from here.
      </p>
    </div>
  );
}
