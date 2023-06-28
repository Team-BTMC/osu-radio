import { createSignal, onCleanup, onMount } from 'solid-js';
import { NoScene } from './scenes/NoScene';



export default function SceneSwitcher(props) {
  const [scene, setScene] = createSignal("");

  const listener = (s: string) => {
    setScene(s);
  }
  const eventHandler = (event) => {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    setScene(event.detail.scene);
  };

  onMount(() => {
    window.api.listen("changeScene", listener);
    window.addEventListener("changeScene", eventHandler);
  });

  onCleanup(() => {
    window.api.removeListener("changeScene", listener);
    window.removeEventListener("changeScene", eventHandler);
  });

  return (
    <>
      {props.children.find(e => e.id === scene()) ?? <NoScene></NoScene>}
    </>
  );
}
