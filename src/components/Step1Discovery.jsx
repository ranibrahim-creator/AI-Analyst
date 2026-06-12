import Composer from "./Composer.jsx";
import NoonBrandLogo from "./NoonBrandLogo.jsx";

// Notion-style home: logo, short headline, compact inline composer, starter chips.
export default function Step1Discovery({ prompt, onPromptChange, onStart, suggestions = [] }) {
  return (
    <div className="mx-auto flex min-h-[62vh] w-full max-w-xl flex-col items-center justify-center px-2 text-center">
      <NoonBrandLogo size="hero" className="mb-5" />

      <h1 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[28px]">
        How can I help you today?
      </h1>

      <div className="mt-6 w-full">
        <Composer
          mode="hero"
          value={prompt}
          onChange={onPromptChange}
          onSubmit={onStart}
          placeholder="Ask the analyst anything…"
          buttonLabel="Start"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="mt-5 grid w-full grid-cols-2 gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onPromptChange(s.prompt)}
              className="rounded-xl bg-black/[0.03] px-3 py-2.5 text-left text-[13px] leading-snug text-ink-soft transition-colors hover:bg-black/[0.05] hover:text-ink"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
