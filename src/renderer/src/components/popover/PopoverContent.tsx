import { Component, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { usePopover } from "./Popover";
import { ComputePositionReturn } from "@floating-ui/dom";
import createFocusTrap from "solid-focus-trap";

function stylesFromPosition(position: ComputePositionReturn | null): JSX.CSSProperties | undefined {
  if (!position) {
    return;
  }

  return {
    top: `${position.y}px`,
    left: `${position.x}px`
  };
}

type Props = JSX.IntrinsicElements["div"];
const PopoverContent: Component<Props> = (props) => {
  const state = usePopover();

  createFocusTrap({
    element: state.contentRef,
    enabled: state.isOpen
  });

  return (
    <Show when={state.isOpen()}>
      <div
        {...props}
        class={`popover-content ${props.class}`}
        ref={state.setContentRef}
        style={stylesFromPosition(state.position())}
      />
    </Show>
  );
};

export default PopoverContent;
