import "../../../assets/css/song/song-context-menu.css";
import {
  Accessor,
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
  coords: Accessor<[number, number]>;
  children: any;
  isContextOpen: Signal<boolean>;
};

const SongContextMenu: Component<SongContextMenuProps> = (props) => {
  const [show, setShow] = props.show;
  const [pos, setPos] = createSignal<[number, number]>(props.coords());
  let menu: HTMLDivElement | undefined;

  const windowContextMenu = (evt: MouseEvent) => {
    const t = evt.target;

    if (!(t instanceof HTMLElement)) {
      return;
    }

    const targetItem = t.closest(".group");
    const menuParent = menu?.closest(".group");
    setPos([evt.layerX, evt.layerY]);

    // console.log(menu, targetItem, menuParent, evt.target);
    // console.log(props.children);

    if (targetItem === menuParent) {
      evt.stopPropagation();
    } else {
      setShow(false);
      props.isContextOpen[1](false);
    }
  };

  onMount(() => {
    createEffect(() => {
      const s = show();

      if (s === false) {
        window.removeEventListener("contextmenu", windowContextMenu);
        return;
      }

      props.isContextOpen[1](true);

      window.addEventListener(
        "click",
        () => {
          setShow(false);
          props.isContextOpen[1](false);
        },
        { once: true },
      );
      window.addEventListener("contextmenu", windowContextMenu);
    });
  });

  onCleanup(() => {
    window.removeEventListener("click", () => {
      setShow(false);
      props.isContextOpen[1](false);
    });
    window.removeEventListener("contextmenu", windowContextMenu);
  });

  return (
    <Show when={show()}>
      <div
        class={"absolute z-30 overflow-hidden rounded-md bg-thick-material shadow-lg"}
        style={{ top: pos()[1] + "px", left: pos()[0] + "px" }}
        ref={menu}
      >
        <div class="relative z-30 bg-gradient-to-b from-black/30 to-transparent">
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
