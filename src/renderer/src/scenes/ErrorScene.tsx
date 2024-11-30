import Button from "@renderer/components/button/Button";
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
    <div id="error" class="grid h-screen w-full place-items-center">
      <div class="space-y-4 rounded-2xl border border-danger/20 bg-danger/5 p-6 shadow-2xl">
        <h2>{msg()}</h2>
        <Button onClick={dismissed}>Dismiss</Button>
      </div>
    </div>
  );
}
