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
        obsidian: {
          950: "#06020c",
          900: "#0c0517",
          850: "#110720",
          800: "#170b2c",
          750: "#1f0e3a",
          700: "#2b144d",
          600: "#3d1b6e",
          500: "#552799",
        },
        ember: {
          DEFAULT: "#f43f5e",
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          glow: "rgba(244, 63, 94, 0.45)",
        },
        emeraldWhite: {
          DEFAULT: "#ecfdf5",
          50: "#ffffff",
          100: "#f0fdf4",
          200: "#d1fae5",
          300: "#a7f3d0",
          400: "#6ee7b7",
          500: "#34d399",
        },
        bg: {
          dark0: "#06020c",
          dark1: "#0c0517",
          dark2: "#140926",
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
        heading: ["'Space Grotesk'", "'Inter'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        tech: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
