import { Component, onCleanup } from "solid-js";

type SongContextMenuItemProps = {
  onClick: (event: MouseEvent) => any;
  children: any;
};

const SongContextMenuItem: Component<SongContextMenuItemProps> = (props) => {
  let item: HTMLElement | undefined;

  const divAccessor = (div: HTMLElement) => {
    div.addEventListener("click", props.onClick);
    item = div;
  };

  onCleanup(() => {
    item?.removeEventListener("click", props.onClick);
  });

  return (
    <button
      ref={divAccessor}
      class="flex flex-row items-center justify-between gap-3 rounded-md bg-thick-material p-2 text-left transition-colors duration-200 hover:bg-accent/20"
    >
      {props.children}
    </button>
  );
};

export default SongContextMenuItem;
