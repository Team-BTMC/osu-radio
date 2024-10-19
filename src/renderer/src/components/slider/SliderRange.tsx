import { useSlider } from "./Slider";
import { Component, JSX } from "solid-js";

const SliderRange: Component<JSX.IntrinsicElements["span"]> = (props) => {
  const state = useSlider();

  return (
    <span
      {...props}
      style={{
        ...state.transitionStyleValue(),
        width: `${state.percentage()}%`,
        "pointer-events": "none",
        "transition-property": "width",
      }}
    />
  );
};

export default SliderRange;
