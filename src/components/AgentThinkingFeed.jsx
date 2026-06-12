import { useEffect, useState } from "react";

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] pl-0.5" aria-hidden>
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

// Swaps one thinking line at a time with a trailing loading ellipsis.
export default function AgentThinkingFeed({ lines = [], active = true }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active || lines.length <= 1) return undefined;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length);
        setVisible(true);
      }, 220);
    }, 2400);

    return () => clearInterval(interval);
  }, [lines, active]);

  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [lines]);

  if (!lines.length) return null;

  const line = lines[index] ?? lines[0];

  return (
    <div className="px-5 py-4" aria-live="polite" aria-label="Agent thinking">
      <p
        className={`flex items-center text-[13px] leading-snug text-ink-soft transition-all duration-300 ease-in-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <span className="min-w-0 truncate">{line}</span>
        <LoadingDots />
      </p>
    </div>
  );
}
