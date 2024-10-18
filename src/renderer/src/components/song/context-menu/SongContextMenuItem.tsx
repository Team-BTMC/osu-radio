import Button from "@renderer/components/button/Button";
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
    <Button
      ref={divAccessor}
      variant={"ghost"}
      class="flex min-w-56 flex-row items-center justify-between rounded-md bg-thick-material text-left transition-colors duration-200 hover:bg-accent/20"
    >
      {props.children}
    </Button>
  );
};

export default SongContextMenuItem;
