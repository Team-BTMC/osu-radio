import "../../assets/css/scenes/loading.css";
import Bar from '../Bar';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { LoadingSceneSettings } from '../../../../@types';
import { clamp } from '../../lib/tungsten/math';



export default function LoadingScene() {
  const [title, setTitle] = createSignal("");
  const [hint, setHint] = createSignal("");
  const [current, setCurrent] = createSignal(0);
  const [max, setMax] = createSignal(1);

  const settings = (s: LoadingSceneSettings) => {
    if (s.title !== undefined) {
      setTitle(s.title ?? "");
    }

    if (s.hint !== undefined) {
      setHint(s.hint ?? "");
    }

    if (s.title !== undefined) {
      setMax(clamp(1, Infinity, s.max));
    }
  }

  onMount(() => {
    window.api.listen("loadingSettings", settings);
    window.api.listen("loadingUpdate", setCurrent);
    window.api.listen("loadingUpdate", setHint);
  });

  onCleanup(() => {
    window.api.removeListener("loadingSettings", settings);
    window.api.removeListener("loadingUpdate", setCurrent);
    window.api.removeListener("loadingUpdate", setHint);
  });

  return (
    <div id="loading" class="scene center col">
      <h3 class="title">{title()}</h3>

      <div class="container">
        <Bar fill={current() / max()}/>
        <span class="label">{current()}/{max()}</span>
      </div>

      <span class="hint">{hint()}</span>
    </div>
  );
}