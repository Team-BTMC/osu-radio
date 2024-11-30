import { useSlider } from "./Slider";
import { sn } from "@renderer/lib/css.utils";
import { Component, JSX, createMemo } from "solid-js";

const SliderRange: Component<JSX.IntrinsicElements["span"]> = (props) => {
  const state = useSlider();

  // Memoize the style calculations
  const computedStyle = createMemo(() => {
    return sn(
      state.transitionStyleValue(),
      {
        width: `${state.percentage()}%`,
        "pointer-events": "none",
        "transition-property": "width",
      },
      props.style,
    );
  });

  return <span {...props} style={computedStyle()} />;
};

export default SliderRange;
