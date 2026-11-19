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
        qalb: {
          green: "#11382B",
          "green-dark": "#0B261D",
          "green-light": "#E3EDE8",
          gold: "#CCA768",
          "gold-hover": "#BFA05E",
          "gold-subtle": "#F5EFE3",
          bg: "#F7F5F0",
          card: "#FFFFFF",
          "card-subtle": "#F1EEE7",
          border: "#EFECE6",
          ink: "#1A2822",
          muted: "#7D8A83",
          // Dark Mode
          "night-bg": "#0C1310",
          "night-card": "#141D18",
          "night-subtle": "#1A2520",
          "night-border": "#223129",
          "night-ink": "#F4F7F5",
          "night-muted": "#9EADA5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        quran: ["'Scheherazade New'", "'Amiri'", "serif"],
        "arabic-ui": ["'Noto Naskh Arabic'", "system-ui", "sans-serif"],
        amiri: ["'Scheherazade New'", "'Amiri'", "serif"],
        indopak: ["'Scheherazade New'", "'Amiri'", "serif"],
      },
      boxShadow: {
        "qalb-card": "0 2px 12px -2px rgba(26, 40, 34, 0.04)",
        "qalb-float": "0 8px 30px -4px rgba(17, 56, 43, 0.12)",
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
