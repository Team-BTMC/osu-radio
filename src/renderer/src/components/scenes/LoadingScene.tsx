import "../../assets/css/scenes/loading.css";
import Bar from '../Bar';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { LoadingSceneUpdate } from '../../../../@types';
import { clamp } from '../../lib/tungsten/math';



export default function LoadingScene() {
  const [title, setTitle] = createSignal("");
  const [hint, setHint] = createSignal("");
  const [current, setCurrent] = createSignal(0);
  const [max, setMax] = createSignal(1);

  const update = (u: LoadingSceneUpdate) => {
    setCurrent(u.current);

    if (u.max !== undefined) {
      setMax(clamp(1, Infinity, u.max));
    }

    if (u.hint !== undefined) {
      setHint(u.hint ?? "");
    }
  }

  onMount(() => {
    window.api.listen("loadingScene::setTitle", setTitle);
    window.api.listen("loadingScene::update", update);
  });

  onCleanup(() => {
    window.api.removeListener("loadingScene::setTitle", setTitle);
    window.api.removeListener("loadingScene::update", update);
  });

  return (
    <div id="loading" class="scene center col">
      <h3 class="title">{title()}</h3>

      <div class="container">
        <Bar fill={current() / max()}/>
        {/*<span class="label">{current()}/{max()}</span>*/}
      </div>

      <span class="hint">{hint()}</span>
    </div>
  );
}