import { Component, JSX, onCleanup } from "solid-js";
import { twMerge } from "tailwind-merge";

type SongContextMenuItemProps = {
  onClick: (event: MouseEvent) => any;
  children: any;
  class?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["class"];
  disabled?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
};

const SongContextMenuItem: Component<SongContextMenuItemProps> = (props) => {
  let item: HTMLElement | undefined;
  const buttonDisabled = props.disabled !== undefined ? props.disabled : false;

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
      class={twMerge(
        "flex flex-row items-center justify-between gap-3 rounded-md bg-thick-material p-2 text-left transition-colors duration-200 hover:cursor-pointer hover:bg-accent/20",
        props.class,
        buttonDisabled && "text-subtext/20 hover:cursor-auto hover:bg-inherit",
      )}
      disabled={buttonDisabled}
    >
      {props.children}
    </button>
  );
};

export default SongContextMenuItem;
