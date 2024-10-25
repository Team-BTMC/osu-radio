import "../../../assets/css/song/song-context-menu.css";
import { Component, For, JSX } from "solid-js";

type SongContextMenuProps = {
  children: JSX.Element | JSX.Element[];
};

const SongContextMenu: Component<SongContextMenuProps> = (props) => {
  let menu: HTMLDivElement | undefined;

  return (
    <div
      class="z-30 min-w-48 rounded-xl border border-stroke bg-thick-material max-h-screen overflow-y-scroll [scrollbar-width:none]"
      ref={menu}
    >
      <div class="flex flex-col gap-1 rounded-xl bg-thick-material p-2">
        <For
          fallback={<div>asdasd</div>}
          each={Array.isArray(props.children) ? props.children : [props.children]}
        >
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
