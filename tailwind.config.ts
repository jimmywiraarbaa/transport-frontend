import type { Config } from "tailwindcss";

/**
 * Lilac accent palette — soft violet/purple shades used ONLY as accent.
 * Backgrounds and surfaces stay neutral (white / slate) to keep a clean,
 * minimalist modern look.
 */
const lilac: Record<string, string> = {
  50: "#f6f4ff",
  100: "#ece8ff",
  200: "#dacfff",
  300: "#c1acff",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95",
  950: "#2e1065",
};

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lilac: lilac,
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        card: "0 4px 16px -2px rgb(16 24 40 / 0.06), 0 2px 6px -2px rgb(16 24 40 / 0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
