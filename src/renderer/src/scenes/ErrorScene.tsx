import { createSignal, onCleanup, onMount } from "solid-js";
import Button from "@renderer/components/button/Button";
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
    <div id="error" class="w-full h-screen grid place-items-center">
      <div class="p-6 rounded-2xl border border-danger/20 shadow-2xl space-y-4 bg-danger/5">
        <h2>{msg()}</h2>
        <Button onClick={dismissed}>Dismiss</Button>
      </div>
    </div>
  );
}
