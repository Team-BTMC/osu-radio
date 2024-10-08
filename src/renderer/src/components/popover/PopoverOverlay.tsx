import { Component, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { usePopover } from "./Popover";

type Props = JSX.IntrinsicElements["div"];
const PopoverOverlay: Component<Props> = (props) => {
  const state = usePopover();
  return (
    <Show when={state.isOpen()}>
      <div {...props} onClick={state.close} class={`popover-overlay ${props.class}`} />
    </Show>
  );
};

export default PopoverOverlay;
