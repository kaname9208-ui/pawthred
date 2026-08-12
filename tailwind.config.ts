import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        paper: "#FFFFFF",
        ink: "#1A1A1A",
        charcoal: "#2B2B2B",
        muted: "#6B6B6B",
        warm: "#BD8C5E",
        "warm-dark": "#9A6F45",
        "warm-soft": "#F1E6D8",
        line: "#E7E1D8",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        soft: "0 6px 24px rgba(26,26,26,0.06)",
        card: "0 2px 12px rgba(26,26,26,0.05)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeup: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeup: "fadeup 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
