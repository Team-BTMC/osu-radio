import type { JSX } from 'solid-js';
import { createSignal, Match, onCleanup, onMount, Switch } from 'solid-js';
import Gradient from './components/Gradient';
import MainScene from './components/scenes/MainScene';
import DirSelectScene from './components/scenes/DirSelectScene';
import NoScene from './components/scenes/NoScene';
import LoadingScene from './components/scenes/LoadingScene';
import { Scenes } from '../../@types';
import ErrorScene from './components/scenes/ErrorScene';
import { TokenNamespace } from './lib/tungsten/token';



export default function App(): JSX.Element {
  const [scene, setScene] = createSignal<Scenes>("");

  const eventHandler = (event) => {
    console.log(event, event instanceof CustomEvent);

    if (!(event instanceof CustomEvent)) {
      return;
    }

    setScene(event.detail.scene);
  };

  onMount(() => {
    window.api.listen("changeScene", setScene);
    window.addEventListener("changeScene", eventHandler);
  });

  onCleanup(() => {
    window.api.removeListener("changeScene", setScene);
    window.removeEventListener("changeScene", eventHandler);
  });

  return (
    <Gradient>
      <Switch fallback={<NoScene/>}>
        <Match when={scene() === "dir-select"}>
          <DirSelectScene/>
        </Match>
        <Match when={scene() === "main"}>
          <MainScene/>
        </Match>
        <Match when={scene() === "loading"}>
          <LoadingScene/>
        </Match>
        <Match when={scene() === "error"}>
          <ErrorScene/>
        </Match>
      </Switch>
    </Gradient>
  );
}



export const GLOBAL_ICON_SCALE = 1.32;



export const namespace = new TokenNamespace();