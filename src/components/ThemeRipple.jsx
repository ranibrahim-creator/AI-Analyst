import { useEffect, useRef } from "react";

export default function ThemeRipple({ ripple, onComplete }) {
  const layerRef = useRef(null);

  useEffect(() => {
    if (!ripple) return undefined;

    const layer = layerRef.current;
    if (!layer) return undefined;

    layer.style.clipPath = `circle(0% at ${ripple.x}px ${ripple.y}px)`;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        layer.style.clipPath = `circle(150% at ${ripple.x}px ${ripple.y}px)`;
      });
    });

    const timer = window.setTimeout(onComplete, 680);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [ripple, onComplete]);

  if (!ripple) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000]"
      style={{
        backgroundColor: ripple.targetDark ? "#111110" : "#f7f7f5",
        clipPath: `circle(0% at ${ripple.x}px ${ripple.y}px)`,
        transition: "clip-path 620ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}
