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
        "flex flex-row items-center justify-between gap-3 rounded-md py-1.5 pl-2.5 pr-2 text-left hover:cursor-pointer hover:bg-surface align-baseline w-full max-w-40",
        props.class,
        buttonDisabled && "text-overlay hover:cursor-auto hover:bg-transparent",
      )}
      disabled={buttonDisabled}
    >
      <div class="flex flex-row items-center justify-between w-full gap-1">{props.children}</div>
    </button>
  );
};

export default SongContextMenuItem;
