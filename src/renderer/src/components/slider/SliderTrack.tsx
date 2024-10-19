import { JSX, ParentComponent } from "solid-js";

const SliderTrack: ParentComponent<JSX.IntrinsicElements["span"]> = (props) => {
  return (
    <span
      style={{
        "pointer-events": "none",
      }}
      {...props}
    />
  );
};

export default SliderTrack;
