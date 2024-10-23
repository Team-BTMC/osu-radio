/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "notice-slide-in": {
          "0%": { transform: "translateY(-100%)", filter: "blur(4px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "notice-slide-in": "notice-slide-in 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      colors: {
        transparent: "transparent",
        "thick-material": "rgba(var(--color-thick-material), 0.9)",
        "regular-material": "rgba(var(--color-regular-material), 0.8)",
        "thin-material": "rgba(var(--color-thin-material), 0.5)",
        text: "rgba(var(--color-text))",
        subtext: "rgba(var(--color-subtext), 0.7)",
        stroke: "rgba(var(--color-stroke), 0.1)",
        overlay: "rgba(var(--color-overlay), 0.55)",
        accent: "rgba(var(--color-accent))",
        surface: "rgba(var(--color-surface), 0.2)",
        black: "rgba(var(--color-black))",
        red: "rgba(var(--color-red))",
        green: "rgba(var(--color-green))",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  darkMode: "media",
};
