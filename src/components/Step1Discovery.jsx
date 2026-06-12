import { useState } from "react";
import Composer from "./Composer.jsx";
import NoonBrandLogo from "./NoonBrandLogo.jsx";

function SuggestionIcon({ type }) {
  const className = "h-[18px] w-[18px] shrink-0 text-ink-muted";

  switch (type) {
    case "summary":
      return (
        <svg viewBox="0 0 18 18" className={className} aria-hidden>
          <path
            d="M4.5 3h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M6.5 6.5h5M6.5 9h5M6.5 11.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M11.5 2.5l1.8 1.8M12.8 2.2l.5 2.3-2.3-.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "friction":
      return (
        <svg viewBox="0 0 18 18" className={className} aria-hidden>
          <circle cx="8" cy="8" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M11.2 11.2l3.3 3.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M6.2 9.2c.5-1.2 1.6-2 2.8-2 1.5 0 2.7 1.2 2.7 2.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "digest":
      return (
        <svg viewBox="0 0 18 18" className={className} aria-hidden>
          <rect x="3.5" y="4" width="11" height="11" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3.5 7h11M6.5 3v2.5M11.5 3v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6.5 10h2M6.5 12.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "onboarding":
      return (
        <svg viewBox="0 0 18 18" className={className} aria-hidden>
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M6.2 9.1l1.8 1.8 3.8-3.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

// Notion-style home: logo, short headline, compact inline composer, starter cards.
export default function Step1Discovery({ prompt, onPromptChange, onStart, suggestions = [] }) {
  const [showSuggestions, setShowSuggestions] = useState(true);

  return (
    <div className="mx-auto flex min-h-[62vh] w-full max-w-3xl flex-col items-center justify-center px-2 text-center">
      <NoonBrandLogo size="hero" className="mb-5" />

      <h1 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[28px]">
        How can I help you today?
      </h1>

      <div className="mt-6 w-full max-w-xl">
        <Composer
          mode="hero"
          value={prompt}
          onChange={onPromptChange}
          onSubmit={onStart}
          placeholder="Ask the analyst anything…"
          buttonLabel="Start"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-6 w-full text-left">
          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <span className="text-[13px] text-ink-muted">Get started</span>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              aria-label="Dismiss suggestions"
              className="grid h-6 w-6 place-items-center rounded-md text-ink-faint transition-colors hover:bg-black/[0.04] hover:text-ink-muted"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onPromptChange(s.prompt)}
                className="flex min-h-[88px] flex-col items-start rounded-2xl bg-[#f1f1ef] px-3.5 py-3.5 text-left transition-colors hover:bg-[#ebebe8]"
              >
                <SuggestionIcon type={s.icon} />
                <span className="mt-3 text-[13px] leading-[1.35] text-ink">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
