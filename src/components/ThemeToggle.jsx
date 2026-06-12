import { useEffect, useState } from "react";

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function MorphingSunMoon({ darkMode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <g
        className="transition-all duration-500 ease-out"
        style={{
          transform: darkMode ? "scale(0)" : "scale(1)",
          transformOrigin: "12px 12px",
          transformBox: "fill-box",
          opacity: darkMode ? 0 : 1,
        }}
      >
        {RAY_ANGLES.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 12 + Math.cos(rad) * 7.2;
          const y2 = 12 + Math.sin(rad) * 7.2;
          return (
            <line
              key={angle}
              x1={12}
              y1={12}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      <circle cx="12" cy="12" r="5.2" fill="currentColor" className="transition-all duration-500 ease-out" />

      <circle
        cx={darkMode ? 15.4 : 23}
        cy="9.8"
        r="4.6"
        className={`transition-all duration-500 ease-out ${darkMode ? "fill-[#2d2a3d]" : "fill-white"}`}
      />
    </svg>
  );
}

export default function ThemeToggle({ darkMode, onToggle }) {
  const [visualDark, setVisualDark] = useState(darkMode);
  const [squash, setSquash] = useState(false);

  useEffect(() => {
    setVisualDark(darkMode);
  }, [darkMode]);

  function handleClick(event) {
    const nextDark = !visualDark;
    setVisualDark(nextDark);
    setSquash(true);
    onToggle(event);
    window.setTimeout(() => setSquash(false), 240);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={visualDark}
      aria-label={visualDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleClick}
      className={`relative h-8 w-16 shrink-0 rounded-full transition-colors duration-500 ease-in-out ${
        visualDark ? "bg-[#1a1a2e]" : "bg-[#93c5fd]"
      }`}
    >
      <span
        className={`absolute top-[3px] grid h-[26px] w-[26px] place-items-center rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-[transform,background-color,color] duration-500 ease-spring will-change-transform ${
          visualDark
            ? "translate-x-[34px] bg-[#2d2a3d] text-[#fde68a]"
            : "translate-x-[3px] bg-white text-[#f59e0b]"
        } ${squash ? "scale-x-110 scale-y-90" : "scale-100"}`}
      >
        <MorphingSunMoon darkMode={visualDark} />
      </span>
    </button>
  );
}
