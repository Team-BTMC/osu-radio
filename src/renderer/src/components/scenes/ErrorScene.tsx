import "../../assets/css/scenes/error.css";
import { createSignal, onCleanup, onMount } from "solid-js";

export default function ErrorScene() {
  const [msg, setMsg] = createSignal("");

  onMount(() => {
    window.api.listen("error::setMessage", setMsg);
  });

  onCleanup(() => {
    window.api.removeListener("error::setMessage", setMsg);
  });

  const dismissed = () => {
    window.api.request("error::dismissed");
  };

  return (
    <div id="error" class="scene center col">
      <h3 classList={{ "no-bg": msg() === "" }}>{msg()}</h3>
      <button onClick={dismissed}>Dismiss</button>
    </div>
  );
}
