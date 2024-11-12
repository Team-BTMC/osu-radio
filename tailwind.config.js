/** @type {import('tailwindcss').Config} */
import { noticeAnimations } from "./src/renderer/src/components/notice/NoticeAnimations";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        ...noticeAnimations.keyframes,
      },
      animation: {
        ...noticeAnimations.animation,
      },
      colors: {
        transparent: "transparent",
        "thick-material": "rgba(var(--color-thick-material), 0.9)",
        "regular-material": "rgba(var(--color-regular-material), 0.8)",
        "thin-material": "rgba(var(--color-thin-material), 0.5)",
        text: "rgba(var(--color-text))",
        subtext: "rgba(var(--color-subtext))",
        stroke: "rgba(var(--color-stroke), 0.1)",
        overlay: "rgba(var(--color-overlay))",
        surface: "rgba(var(--color-surface), 0.2)",
        black: "rgba(var(--color-black))",
        danger: "rgba(var(--color-red))",
        green: "rgba(var(--color-green))",
      },
      boxShadow: {
        "glow-blue": "0px 0px 10px #4EBFFF, 0px 0px 28px rgba(78, 191, 255, 0.72)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  darkMode: "media",
};
