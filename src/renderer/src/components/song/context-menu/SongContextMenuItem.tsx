import { Component, JSX, onCleanup, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

type SongContextMenuItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick: (event: MouseEvent) => any;
};

const SongContextMenuItem: Component<SongContextMenuItemProps> = (props) => {
  let item: HTMLElement | undefined;
  const [local, other] = splitProps(props, ["children", "class", "onClick", "disabled"]);
  const buttonDisabled = local.disabled !== undefined ? local.disabled : false;

  const divAccessor = (div: HTMLElement) => {
    div.addEventListener("click", local.onClick);
    item = div;
  };

  onCleanup(() => {
    item?.removeEventListener("click", local.onClick);
  });

  return (
    <button
      ref={divAccessor}
      class={twMerge(
        "flex w-full max-w-40 flex-row items-center justify-between gap-3 rounded-md py-1.5 pl-2.5 pr-2 text-left align-baseline hover:cursor-pointer hover:bg-surface",
        local.class,
        buttonDisabled && "text-overlay hover:cursor-auto hover:bg-transparent",
      )}
      {...other}
    >
      <div class="flex w-full flex-row items-center justify-between gap-1">{local.children}</div>
    </button>
  );
};

export default SongContextMenuItem;
