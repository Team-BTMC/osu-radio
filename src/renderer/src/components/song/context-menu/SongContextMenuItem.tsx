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
        "flex flex-row items-center justify-between gap-3 rounded-md py-1.5 pl-2.5 pr-2 text-left hover:cursor-pointer hover:bg-surface align-baseline",
        props.class,
        buttonDisabled && "text-overlay hover:cursor-auto hover:bg-transparent",
      )}
      disabled={buttonDisabled}
    >
      {props.children}
    </button>
  );
};

export default SongContextMenuItem;
