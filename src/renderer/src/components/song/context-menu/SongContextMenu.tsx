import "../../../assets/css/song/song-context-menu.css";
import { computePosition, inline, shift } from "@floating-ui/dom";
import {
  Component,
  createEffect, // createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  Signal,
} from "solid-js";

type SongContextMenuProps = {
  show: Signal<boolean>;
  children: any;
};

const SongContextMenu: Component<SongContextMenuProps> = (props) => {
  const [show, setShow] = props.show;
  let menu: HTMLDivElement | undefined;

  const windowContextMenu = (evt: MouseEvent) => {
    const t = evt.target;

    if (!(t instanceof HTMLElement)) {
      return;
    }

    const targetItem = t.closest(".group");

    if (targetItem !== null && menu !== undefined) {
      const useCustomCoords = {
        name: "useCustomCoords",
        fn() {
          return { x: evt.offsetX + 30, y: evt.clientY - 52 };
        },
      };

      computePosition(targetItem, menu, {
        middleware: [useCustomCoords, inline(), shift({ crossAxis: true })],
      }).then(({ x, y }) => {
        Object.assign(menu.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }
  };

  onMount(() => {
    createEffect(() => {
      const s = show();

      if (s === false) {
        window.removeEventListener("contextmenu", windowContextMenu);
        return;
      }

      window.addEventListener(
        "click",
        () => {
          setShow(false);
        },
        { once: true },
      );
      window.addEventListener("contextmenu", windowContextMenu);
    });
  });

  onCleanup(() => {
    window.removeEventListener("click", () => {
      setShow(false);
    });
    window.removeEventListener("contextmenu", windowContextMenu);
  });

  return (
    <Show when={show()}>
      <div class={"absolute left-0 top-0 z-30 rounded-lg bg-thick-material"} ref={menu}>
        <div class="flex flex-col gap-1 rounded-lg bg-thick-material p-2">
          <For each={props.children}>{(child) => child}</For>
        </div>
      </div>
    </Show>
  );
};

export default SongContextMenu;
