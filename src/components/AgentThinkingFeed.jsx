import { useEffect, useRef } from "react";

// Vertically auto-scrolling agent thought feed — lives inside the composer dock.
export default function AgentThinkingFeed({ lines = [], active = true }) {
  const scroller = useRef(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !active) return undefined;

    let frame;
    let pos = 0;
    const tick = () => {
      pos += 0.35;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lines, active]);

  if (!lines.length) return null;

  return (
    <div
      ref={scroller}
      className="think-feed max-h-[88px] overflow-hidden px-4 py-3"
      aria-live="polite"
      aria-label="Agent thinking"
    >
      <div className="space-y-2">
        {[...lines, ...lines].map((line, i) => (
          <p key={i} className="text-[13px] leading-snug text-ink-soft">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
