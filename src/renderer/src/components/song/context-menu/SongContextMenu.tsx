import "../../../assets/css/song/song-context-menu.css";
import { Component, For } from "solid-js";

type SongContextMenuProps = {
  children: any;
};

const SongContextMenu: Component<SongContextMenuProps> = (props) => {
  let menu: HTMLDivElement | undefined;

  return (
    <div class="z-30 rounded-lg bg-thick-material" ref={menu}>
      <div class="flex flex-col gap-1 rounded-lg bg-thick-material p-2">
        <For each={props.children}>{(child) => child}</For>
      </div>
    </div>
  );
};

export default SongContextMenu;
