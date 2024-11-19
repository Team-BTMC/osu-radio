import { usePopover } from "./Popover";
import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"];
const PopoverTrigger: Component<Props> = (props) => {
  const state = usePopover();

  return (
    <button
      ref={state.setTriggerRef}
      data-open={state.isOpen()}
      onClick={() => {
        state?.toggle();
      }}
      {...props}
    />
  );
};

export default PopoverTrigger;
