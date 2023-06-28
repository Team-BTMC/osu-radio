import type { JSX } from 'solid-js';
import { createSignal, Match, onCleanup, onMount, Switch } from 'solid-js';
import Gradient from './components/Gradient';
import MainScene from './components/scenes/MainScene';
import DirSelectScene from './components/scenes/DirSelectScene';
import { NoScene } from './components/scenes/NoScene';



export default function App(): JSX.Element {
  const [topColor, setTopColor] = createSignal('dodgerblue');
  const [scene, setScene] = createSignal("");

  const listener = (s: string) => {
    setScene(s);
  }
  const eventHandler = (event) => {
    console.log(event, event instanceof CustomEvent);

    if (!(event instanceof CustomEvent)) {
      return;
    }

    setScene(event.detail.scene);
  };

  onMount(() => {
    window.api.listen("changeScene", listener);
    window.addEventListener("changeScene", eventHandler);
    window.addEventListener('click', () => {
      setTopColor('dodgerblue');
    });
  });

  onCleanup(() => {
    window.api.removeListener("changeScene", listener);
    window.removeEventListener("changeScene", eventHandler);
  });

  return (
    <Gradient bottomColor='crimson' topColor={topColor()}>
      <Switch fallback={<NoScene />}>
        <Match when={scene() === "dir-select"}>
          <DirSelectScene />
        </Match>
        <Match when={scene() === "main"}>
          <MainScene />
        </Match>
      </Switch>
    </Gradient>
  );
}
