import { useSlider } from "./Slider";
import { sn } from "@renderer/lib/css.utils";
import { linearScale } from "@renderer/lib/linear-scale";
import { Component, createMemo, JSX } from "solid-js";

export function getThumbInBoundsOffset(width: number, left: number) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return halfWidth - offset(left);
}

const SliderThumb: Component<JSX.IntrinsicElements["span"]> = (props) => {
  const state = useSlider();

  const thumbInBoundsOffset = createMemo(() => {
    return getThumbInBoundsOffset(state.thumbWidth(), state.percentage());
  });

  return (
    <span
      style={{
        ...state.transitionStyleValue(),
        position: "absolute",
        left: `calc(${state.percentage()}% + ${thumbInBoundsOffset()}px)`,
        top: "0px",
        "pointer-events": "none",
        "transition-property": "left",
      }}
    >
      <span
        {...props}
        style={sn(
          {
            transform: "translate(-50%)",
          },
          props.style,
        )}
        tabIndex={0}
        ref={state.setThumb}
      />
    </span>
  );
};

export default SliderThumb;
