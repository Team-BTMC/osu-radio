import { popoverStack, usePopover } from "./Popover";
import { Component, For, ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";

export const PopoverPortal: ParentComponent = (props) => {
  const state = usePopover();
  return (
    <Show when={state.isOpen() && state.id()}>
      <Portal mount={document.getElementById(state.id())!}>{props.children}</Portal>
    </Show>
  );
};

export const PopoverPortalMountStack: Component = () => {
  return (
    <For each={popoverStack()}>
      {(id, index) => (
        <div
          style={{
            "z-index": 100 + index(),
            position: "relative",
          }}
          id={id}
        />
      )}
    </For>
  );
};
