import "./SongContextMenu.css";
import { Component, For } from "solid-js";

type SongContextMenuProps = {
  children: any;
};

const SongContextMenu: Component<SongContextMenuProps> = (props) => {
  let menu: HTMLDivElement | undefined;

  return (
    <div class="z-30 min-w-48 rounded-xl border border-stroke bg-thick-material" ref={menu}>
      <div class="flex flex-col gap-1 rounded-xl bg-thick-material p-3">
        <For each={props.children}>{(child) => child}</For>
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
