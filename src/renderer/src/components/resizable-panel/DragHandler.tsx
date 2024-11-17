import { Component } from "solid-js";
import { useResizablePanel } from "./ResizablePanel";
import { cn } from "@renderer/lib/css.utils";

type DragHandlerProps = {
  class?: string;
};
export const DragHandler: Component<DragHandlerProps> = (props) => {
  const state = useResizablePanel();

  return (
    <div
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
      class={cn(
        "opacity-0 hover:opacity-100 h-full w-4 translate-x-[-50%] cursor-w-resize flex flex-col items-center justify-center",
        props.class,
      )}
    >
      <div class="bg-white/60 flex-1 w-0.5" />
    </div>
  );
};
