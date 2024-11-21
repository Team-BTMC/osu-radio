export const songItemAnimations = {
  keyframes: {
    "song-item-slide-in": {
      from: { transform: "translateX(100%)", opacity: 0 },
      to: { transform: "translateX(0)", opacity: 1 },
    },
  },
  animation: {
    "song-item-slide-in": "song-item-slide-in 160ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
  },
};
