import { Component, For, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

type SongContextMenuProps = {
  children: JSX.Element | JSX.Element[];
  class?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["class"];
};

const SongContextMenu: Component<SongContextMenuProps> = (props) => {
  let menu: HTMLDivElement | undefined;

  return (
    <div
      class={twMerge(
        "flex flex-col gap-1 rounded-xl bg-thick-material p-2 z-30 min-w-48 ring-1 ring-inset ring-stroke backdrop-blur-md shadow-xl",
        props.class,
      )}
      ref={menu}
    >
      <div class="flex flex-col">
        <For each={Array.isArray(props.children) ? props.children : [props.children]}>
          {(child) => child}
        </For>
      </div>
    </div>
  );
};

export default SongContextMenu;

export function ignoreClickInContextMenu(fn: (evt: MouseEvent) => any): (evt: MouseEvent) => void {
  return (evt: MouseEvent) => {
    const t = evt.target;

    if (!(t instanceof HTMLElement)) {
      return;
    }

    fn(evt);
  };
}
