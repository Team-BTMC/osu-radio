import { Scenes } from "../../@types";
import NoticeContainer from "./components/notice/NoticeContainer";
import Popover from "./components/popover/Popover";
import "./keyboard-registers/initialize";
import { fetchOs, os, setOs } from "./lib/os";
import { TokenNamespace } from "./lib/tungsten/token";
import ErrorScene from "./scenes/ErrorScene";
import NoScene from "./scenes/NoScene";
import DirSelectScene from "./scenes/dir-select-scene/DirSelectScene";
import LoadingScene from "./scenes/loading-scene/LoadingScene";
import MainScene from "./scenes/main-scene/MainScene";
import type { JSX } from "solid-js";
import { createMemo, createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { sidebarWidth } from "./scenes/main-scene/main.utils";

export default function App(): JSX.Element {
  const [scene, setScene] = createSignal<Scenes>("");

  const eventHandler = (event: unknown) => {
    console.log(event, event instanceof CustomEvent);

    if (!(event instanceof CustomEvent)) {
      return;
    }

    setScene(event.detail.scene);
  };

  onMount(async () => {
    window.api.listen("changeScene", setScene);
    window.addEventListener("changeScene", eventHandler);

    // Sets current OS
    setOs(await fetchOs());
  });

  onCleanup(() => {
    window.api.removeListener("changeScene", setScene);
    window.removeEventListener("changeScene", eventHandler);
  });

  const hasRequiredOptions = createMemo(() => {
    return typeof os() !== "undefined" && typeof sidebarWidth() !== "undefined";
  });

  return (
    <Show when={hasRequiredOptions()}>
      <NoticeContainer />

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

      <Popover.PortalMountStack />
    </Show>
  );
}

export const namespace = new TokenNamespace();
