import { useSlider } from "./Slider";
import { Component, JSX } from "solid-js";

const SliderRange: Component<JSX.IntrinsicElements["span"]> = (props) => {
  const state = useSlider();

  return (
    <span
      {...props}
      style={{
        width: `${state.percentage()}%`,
        "pointer-events": "none",
      }}
    />
  );
};

export default SliderRange;
