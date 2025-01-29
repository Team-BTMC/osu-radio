import { useResizablePanel } from "./ResizablePanel";
import { cn } from "@renderer/lib/css.utils";
import { Component } from "solid-js";

type DragHandlerProps = {
  class?: string;
};
export const DragHandler: Component<DragHandlerProps> = (props) => {
  const state = useResizablePanel();

  return (
    <div
      tabIndex={0}
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);
        event.preventDefault();

        state.handlePointerStart(event);
      }}
      onPointerMove={(event) => {
        const target = event.target as HTMLElement;
        if (!target.hasPointerCapture(event.pointerId)) {
          return;
        }

        state.handlePointerMove(event);
      }}
      onPointerUp={(event) => {
        const target = event.target as HTMLElement;
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId);
          state.handlePointerEnd();
        }
      }}
      onKeyUp={() => {
        state.handleKeyUp();
      }}
      onKeyDown={(event) => {
        state.handleKeyDown();

        switch (event.key) {
          case "ArrowLeft":
            state.handleStep("left");
            break;
          case "ArrowRight":
            state.handleStep("right");
            break;
          case "Home":
            state.handleHomeKeyDown();
            break;
          case "End":
            state.handleEndKeyDown();
            break;

          default:
            break;
        }
      }}
      class={cn(
        "flex h-full w-4 translate-x-[-50%] cursor-w-resize flex-col items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100",
        props.class,
      )}
    >
      <div class="w-0.5 flex-1 bg-white/60" />
    </div>
  );
};
