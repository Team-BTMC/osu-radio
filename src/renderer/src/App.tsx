import { Scenes } from "../../@types";
import "./keyboard-registers/initialize";
import { TokenNamespace } from "./lib/tungsten/token";
import ErrorScene from "./scenes/ErrorScene";
import NoScene from "./scenes/NoScene";
import DirSelectScene from "./scenes/dir-select-scene/DirSelectScene";
import LoadingScene from "./scenes/loading-scene/LoadingScene";
import MainScene from "./scenes/main-scene/MainScene";
import type { JSX } from "solid-js";
import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";

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
    <Switch fallback={<NoScene />}>
      <Match when={scene() === "dir-select"}>
        <DirSelectScene />
      </Match>
      <Match when={scene() === "main"}>
        <MainScene />
      </Match>
      <Match when={scene() === "loading"}>
        <LoadingScene />
      </Match>
      <Match when={scene() === "error"}>
        <ErrorScene />
      </Match>
    </Switch>
  );
}

export const namespace = new TokenNamespace();
