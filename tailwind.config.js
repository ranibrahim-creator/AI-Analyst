/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Noon brand accent — used only as a microscopic status indicator
        noon: "#FEEE00",
        // Soft Claude-like canvas
        canvas: "#F9F9F9",
        ink: {
          DEFAULT: "#23211d",
          soft: "#56524b",
          muted: "#8c887f",
          faint: "#b8b4ab",
        },
        line: "#ece9e3",
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
      },
      animation: {
        "fade-up": "fade-up 280ms ease both",
        blink: "blink 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
