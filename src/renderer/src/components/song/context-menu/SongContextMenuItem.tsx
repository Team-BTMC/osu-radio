import { Component, JSX, onCleanup } from "solid-js";
import { twMerge } from "tailwind-merge";

type SongContextMenuItemProps = {
  onClick: (event: MouseEvent) => any;
  onHover?: (event: MouseEvent) => any;
  children: any;
  class?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["class"];
  disabled?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
};

const SongContextMenuItem: Component<SongContextMenuItemProps> = (props) => {
  let item: HTMLElement | undefined;
  const buttonDisabled = props.disabled !== undefined ? props.disabled : false;

  const divAccessor = (div: HTMLElement) => {
    div.addEventListener("click", props.onClick);
    if (props.onHover !== undefined) {
      div.addEventListener("mouseover", props.onHover);
    }
    item = div;
  };

  onCleanup(() => {
    item?.removeEventListener("click", props.onClick);
    if (props.onHover !== undefined) {
      item?.removeEventListener("mouseover", props.onHover);
    }
  });

  return (
    <button
      ref={divAccessor}
      class={twMerge(
        "gap-3 rounded-md bg-thick-material text-left transition-colors duration-200 hover:cursor-pointer hover:bg-accent/20 w-full",
        props.class,
        buttonDisabled && "text-subtext/20 hover:cursor-auto hover:bg-inherit",
      )}
      disabled={buttonDisabled}
    >
      <div class="flex flex-row items-center justify-between w-full p-2 gap-2">
        {props.children}
      </div>
    </button>
  );
};

export default SongContextMenuItem;
