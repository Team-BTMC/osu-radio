import "../../../assets/css/song/song-context-menu.css";
import {
  Component,
  createEffect,
  createSignal,
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
  const [pos, setPos] = createSignal<[number, number]>([0, 0]);
  let menu: HTMLDivElement | undefined;

  const windowContextMenu = (evt: MouseEvent) => {
    const t = evt.target;

    if (!(t instanceof HTMLElement)) {
      return;
    }

    const targetItem = t.closest(".group");

    if (targetItem !== null) {
      setPos([evt.offsetX + 30, evt.clientY - 52]);
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
      <div
        class={"absolute z-30 rounded-lg bg-thick-material"}
        style={{ top: pos()[1] + "px", left: pos()[0] + "px" }}
        ref={menu}
      >
        <div class="flex flex-col gap-1 rounded-lg bg-thick-material p-2">
          <For each={props.children}>{(child) => child}</For>
        </div>
      </div>
    </Show>
  );
};

export default SongContextMenu;

export function ignoreClickInContextMenu(fn: (evt: MouseEvent) => any): (evt: MouseEvent) => void {
  return (evt: MouseEvent) => {
    const t = evt.target;

    if (!(t instanceof HTMLElement)) {
      fn(evt);
      return;
    }

    const menu = t.closest(".song-menu");

    if (menu !== null) {
      return;
    }

    fn(evt);
  };
}
