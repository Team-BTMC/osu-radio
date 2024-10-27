import { cn, sn } from "@renderer/lib/css.utils";
import { usePopover } from "./Popover";
import { ComputePositionReturn } from "@floating-ui/dom";
import createFocusTrap from "solid-focus-trap";
import { Component, onCleanup, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

function stylesFromPosition(position: ComputePositionReturn | null): JSX.CSSProperties | undefined {
  if (!position) {
    return;
  }

  return {
    top: `${position.y}px`,
    left: `${position.x}px`,
  };
}

export type Props = JSX.IntrinsicElements["div"];
const PopoverContent: Component<Props> = (props) => {
  const state = usePopover();

  createFocusTrap({
    element: state.contentRef,
    enabled: state.isOpen,
  });

  onMount(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          state.close();
          break;

        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyUp);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyUp);
    });
  });

  return (
    <Show when={state.isOpen()}>
      <div
        {...props}
        class={cn(
          "popover-content rounded-lg p-2 border border-stroke bg-thick-material backdrop-blur-md",
          props.class,
        )}
        ref={state.setContentRef}
        style={sn(stylesFromPosition(state.position()), props.style)}
      />
    </Show>
  );
};

export default PopoverContent;
