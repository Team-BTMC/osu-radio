import { usePopover } from "./Popover";
import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type Props = JSX.IntrinsicElements["button"];
const PopoverTrigger: Component<Props> = (props) => {
  const state = usePopover();

  return (
    <button
      ref={state.setTriggerRef}
      onClick={() => {
        state.toggle();
      }}
      {...props}
    />
  );
};

export default PopoverTrigger;
