import { useSlider } from "./Slider";
import { Component, JSX } from "solid-js";

const SliderTime: Component<JSX.IntrinsicElements["span"]> = (props) => {
  const state = useSlider();

  return (
    <span
      style={{
        position: "absolute",
        right: `calc(${100 - state.percentage()}%)`,
        left: "0px",
        top: "0px",
        "pointer-events": "none",
      }}
    >
      <span {...props} />
    </span>
  );
};

export default SliderTime;
