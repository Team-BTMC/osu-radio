import "./styles.css";
import Slider from "@renderer/components/slider/Slider";
import { clamp } from "@shared/lib/tungsten/math";
import { LoadingSceneUpdate } from "@shared/types/common.types";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export default function LoadingScene() {
  const [title, setTitle] = createSignal("");
  const [hint, setHint] = createSignal("");
  const [current, setCurrent] = createSignal(0.4);
  const [max, setMax] = createSignal(1);

  const update = (u: LoadingSceneUpdate) => {
    setCurrent(u.current);

    if (u.max !== undefined) {
      setMax(clamp(1, Infinity, u.max));
    }

    if (u.hint !== undefined) {
      setHint(u.hint ?? "");
    }
  };

  const progressValue = createMemo(() => current() / max());
  onMount(() => {
    window.api.listen("loadingScene::setTitle", setTitle);
    window.api.listen("loadingScene::update", update);
  });

  onCleanup(() => {
    window.api.removeListener("loadingScene::setTitle", setTitle);
    window.api.removeListener("loadingScene::update", update);
  });

  return (
    <div class="loading-scene">
      <h3 class="loading-scene__title">{title()}</h3>

      <Slider max={1} min={0} value={progressValue} class="cursor-default">
        <Slider.Track class="block h-2.5 w-[420px] overflow-hidden rounded bg-thick-material">
          <Slider.Range class="block h-full bg-white" />
        </Slider.Track>
      </Slider>

      <span class="loading-scene__hint">{hint()}</span>
    </div>
  );
}
