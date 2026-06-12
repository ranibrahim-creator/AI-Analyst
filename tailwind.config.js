/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        noon: "#FEEE00",
        canvas: "#F9F9F9",
        app: "var(--app-bg)",
        main: "var(--main-bg)",
        sidebar: "var(--sidebar-bg)",
        elevated: "var(--surface-elevated)",
        suggestion: {
          DEFAULT: "var(--suggestion-bg)",
          hover: "var(--suggestion-hover)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        line: "var(--line)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      maxWidth: {
        reading: "46rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        verticalRoll: {
          "0%, 18%": { transform: "translateY(0%)" },
          "22%, 40%": { transform: "translateY(-25%)" },
          "44%, 62%": { transform: "translateY(-50%)" },
          "66%, 84%": { transform: "translateY(-75%)" },
          "88%, 100%": { transform: "translateY(0%)" },
        },
        "clip-wave": {
          "0%, 100%": { clipPath: "inset(0 0 0 0 round 6px)" },
          "35%": { clipPath: "inset(0 0 10% 0 round 6px)" },
          "70%": { clipPath: "inset(10% 0 0 0 round 6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 280ms ease both",
        blink: "blink 1.1s ease-in-out infinite",
        "vertical-roll": "verticalRoll 5.6s ease-in-out infinite",
        "clip-wave": "clip-wave 1.4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        elastic: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
