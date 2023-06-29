import "../../assets/css/scenes/loading.css";
import Bar from '../Bar';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { clamp } from '../../lib/tungsten/math';
export default function LoadingScene() {
    const [title, setTitle] = createSignal("");
    const [hint, setHint] = createSignal("");
    const [current, setCurrent] = createSignal(0);
    const [max, setMax] = createSignal(1);
    const update = (u) => {
        setCurrent(u.current);
        if (u.max !== undefined) {
            setMax(clamp(1, Infinity, u.max));
        }
        if (u.hint !== undefined) {
            setHint(u.hint ?? "");
        }
    };
    onMount(() => {
        window.api.listen("loadingSetTitle", setTitle);
        window.api.listen("loadingUpdate", update);
    });
    onCleanup(() => {
        window.api.removeListener("loadingSetTitle", setTitle);
        window.api.removeListener("loadingUpdate", update);
    });
    return (<div id="loading" class="scene center col">
      <h3 class="title">{title()}</h3>

      <div class="container">
        <Bar fill={current() / max()}/>
        {/*<span class="label">{current()}/{max()}</span>*/}
      </div>

      <span class="hint">{hint()}</span>
    </div>);
}
