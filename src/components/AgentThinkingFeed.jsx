import { useMemo } from "react";

const DEFAULT_LINES = [
  "Agent is reading files…",
  "Agent is mapping metrics…",
  "Agent is cleaning report…",
];

const LINE_HEIGHT = 28; // 7 * 4px — tight system rhythm
const HOLD_MS = 1000;
const ROLL_MS = 400;

function buildKeyframes(name, count) {
  if (count <= 1) {
    return `@keyframes ${name} { 0%, 100% { transform: translateY(0); } }`;
  }

  const segment = 100 / count;
  const holdRatio = HOLD_MS / (HOLD_MS + ROLL_MS);
  const stops = [];

  for (let i = 0; i < count; i++) {
    const segStart = i * segment;
    const holdEnd = segStart + segment * holdRatio;
    const segEnd = (i + 1) * segment;
    const y = (i / count) * 100;
    const yNext = ((i + 1) / count) * 100;

    stops.push(`${segStart}% { transform: translateY(-${y}%); }`);
    stops.push(`${holdEnd}% { transform: translateY(-${y}%); }`);
    if (i < count - 1) {
      stops.push(`${segEnd}% { transform: translateY(-${yNext}%); }`);
    }
  }

  stops.push(`100% { transform: translateY(0); }`);
  return `@keyframes ${name} { ${stops.join(" ")} }`;
}

// Vertical slot-machine roll — right-aligned, lives inside the composer shell.
export default function AgentThinkingFeed({ lines = [], active = true }) {
  const phrases = lines.length ? lines : DEFAULT_LINES;
  const count = phrases.length;

  const animationName = useMemo(() => `verticalRoll-${count}`, [count]);
  const keyframes = useMemo(() => buildKeyframes(animationName, count), [animationName, count]);
  const duration = count * ((HOLD_MS + ROLL_MS) / 1000);

  if (!active || !phrases.length) return null;

  return (
    <>
      <style>{keyframes}</style>
      <div
        className="w-full overflow-hidden"
        style={{ height: LINE_HEIGHT }}
        aria-live="polite"
        aria-label="Agent thinking"
      >
        <div
          className="vertical-roll-track flex w-full flex-col items-end justify-end"
          style={{
            animation: `${animationName} ${duration}s ease-in-out infinite`,
          }}
        >
          {phrases.map((line, i) => (
            <p
              key={i}
              className="w-full shrink-0 text-right text-[13px] font-medium leading-7 text-ink-muted"
              style={{ height: LINE_HEIGHT }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
