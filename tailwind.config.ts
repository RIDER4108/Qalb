import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sacred: {
          emerald: "#144534",
          "emerald-dark": "#0E3326",
          "emerald-light": "#E1EFE7",
          gold: "#C5A059",
          "gold-hover": "#B38F48",
          "gold-subtle": "#F5EFE1",
          "gold-dark": "#2A210B",
          // Light Mode Canvas (Parchment & Warm Sand)
          "parchment-bg": "#FAF7F2",
          "parchment-card": "#FFFFFF",
          "parchment-subtle": "#F3EDE2",
          "parchment-border": "#E7DFD3",
          "ink-primary": "#1C2421",
          "ink-secondary": "#5C6762",
          "ink-muted": "#8F9A95",
          // Dark Mode Canvas (Obsidian & Emerald Slate)
          "night-bg": "#0C1310",
          "night-card": "#1A2520",
          "night-subtle": "#131C18",
          "night-border": "#25342D",
          "night-primary": "#F4F7F5",
          "night-secondary": "#A7B5AE",
          "night-muted": "#687770",
        },
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "Amiri", "Scheherazade New", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "sacred-card": "0 4px 20px -2px rgba(20, 69, 52, 0.06)",
        "sacred-float": "0 10px 30px -4px rgba(20, 69, 52, 0.15)",
        "night-glow": "0 0 25px -5px rgba(197, 160, 89, 0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
