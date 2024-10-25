export const noticeAnimations = {
  keyframes: {
    "notice-slide-in": {
      from: { transform: "translateY(-100%)", filter: "blur(4px)", opacity: 0 },
      to: { transform: "translateX(0)", opacity: 1 },
    },
    "notice-progress": {
      from: { width: "100%" },
      to: { width: "0%" },
    },
    "notice-slide-out": {
      from: {
        minHeight: "5rem",
        marginBlock: "0.5rem",
      },
      to: {
        "padding-block": "0",
        "margin-block": "0",
        height: "0",
        "min-height": "0",
        "max-height": "0",
        transform: "scale(0.75)",
        "transform-origin": "top right",
        opacity: 0,
        filter: "blur(4px)",
      },
    },
  },
  animation: {
    "notice-slide-in": "notice-slide-in 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
    // TODO: Make this 3000ms configurable
    "notice-progress": "notice-progress 3000ms linear",
    "notice-slide-out": "notice-slide-out 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
  },
};
