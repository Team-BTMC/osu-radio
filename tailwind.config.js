/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        "thick-material": "var(--color-thick-material)",
        "regular-material": "var(--color-regular-material)",
        text: "var(--color-text)",
        subtext: "var(--color-subtext)",
        stroke: "var(--color-stroke)",
        overlay: "var(--color-overlay)",
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        black: "var(--color-black)",
        red: "var(--color-red)",
        green: "var(--color-green)",
        "thin-material": "var(--color-thin-material)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  darkMode: "media", // or 'class' if you prefer manual dark mode switching
};
