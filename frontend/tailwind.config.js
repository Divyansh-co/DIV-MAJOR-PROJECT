/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          dark0: "#060B14",
          dark1: "#0A1628",
          dark2: "#0F1C2E",
        },
        surface: {
          card: "var(--surface-card)",
          hover: "var(--surface-card-hover)",
          border: "var(--surface-card-border)",
        },
        accent: {
          ai: "var(--accent-ai)",
          chain: "var(--accent-chain)",
          amber: "var(--accent-risk-amber)",
          coral: "var(--accent-risk-coral)",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
