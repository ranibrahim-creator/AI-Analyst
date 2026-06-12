import { useEffect, useState } from "react";

const LINE_HEIGHT = 28;

function LoadingDots() {
  return (
    <span className="inline-flex shrink-0 items-center gap-[3px] pl-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-ink-faint animate-blink"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

// Cycles agent thought lines with a vertical slide — no container chrome.
export default function AgentThinkingFeed({ lines = [], active = true }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || lines.length <= 1) return undefined;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [lines, active]);

  useEffect(() => {
    setIndex(0);
  }, [lines]);

  if (!lines.length) return null;

  return (
    <div
      className="overflow-hidden px-2 py-2"
      style={{ height: LINE_HEIGHT }}
      aria-live="polite"
      aria-label="Agent thinking"
    >
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${index * LINE_HEIGHT}px)` }}
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className="flex items-center justify-center text-center text-[13px] leading-snug text-ink-soft"
            style={{ height: LINE_HEIGHT }}
          >
            <span className="min-w-0 truncate">{line}</span>
            {i === index && <LoadingDots />}
          </p>
        ))}
      </div>
    </div>
  );
}
