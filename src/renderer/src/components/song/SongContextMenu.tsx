import { Accessor, Component, createEffect, For, onCleanup, onMount, Show, Signal } from 'solid-js';
import Gradient from '../Gradient';
import "../../assets/css/song/song-context-menu.css";



type SongContextMenuProps = {
  show: Signal<boolean>,
  coords: Accessor<[number, number]>,
  container: any,
  children: any,
}



const SongContextMenu: Component<SongContextMenuProps> = props => {
  const [show, setShow] = props.show;
  let menu;

  const windowClick = (evt: Event) => {
    if ((props.container as HTMLElement).contains(evt.target as Node)) {
      return;
    }

    setShow(false);
  }

  const calculatePosition = () => {
    const c = props.coords();
    menu?.style.setProperty("--x", `${Math.round(c[0])}px`);
    menu?.style.setProperty("--y", `${Math.round(c[1])}px`);
  }

  onMount(() => {
    createEffect(() => {
      const s = show();
      calculatePosition();

      if (s === true) {
        window.addEventListener("pointerdown", windowClick);
        return;
      }

      window.removeEventListener("pointerdown", windowClick);
    });
  });

  onCleanup(() => {
    window.removeEventListener("pointerdown", windowClick);
  });

  return (
    <Show when={show()}>
      <div class={"song-menu"} ref={menu} onClick={evt => evt.stopPropagation()}>
        <Gradient class={"song-menu-container"}>
          <For each={props.children}>{child =>
            child
          }</For>
        </Gradient>
      </div>
    </Show>
  );
}



export default SongContextMenu;