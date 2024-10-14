import Button from "@renderer/components/button/Button";
import { createSignal, onMount } from "solid-js";

export default function DirSelectScene() {
  const [dir, setDir] = createSignal("");

  onMount(() => {
    autodetectDir();
  });

  const autodetectDir = async () => {
    const autoGetDir = await window.api.request("dir::autoGetOsuDir");
    if (autoGetDir.isNone) {
      return;
    }

    setDir(autoGetDir.value);
  };

  const selectDir = async () => {
    const opt = await window.api.request("dir::select");
    if (opt.isNone) {
      return;
    }

    setDir(opt.value);
  };

  const submitDir = async () => {
    if (dir() === "") {
      return;
    }

    await window.api.request("dir::submit", dir());
  };

  const GRADIENT = `radial-gradient(at 1% 75%, hsla(228,61%,67%,0.1) 0px, transparent 50%),
    radial-gradient(at 20% 56%, hsla(87,75%,61%,0.1) 0px, transparent 50%),
    radial-gradient(at 35% 34%, hsla(50,72%,67%,0.1) 0px, transparent 50%),
    radial-gradient(at 50% 18%, hsla(296,74%,62%,0.1) 0px, transparent 50%),
    radial-gradient(at 92% 14%, hsla(54,93%,75%,0.1) 0px, transparent 50%),
    radial-gradient(at 9% 83%, hsla(226,80%,64%,0.1) 0px, transparent 50%),
    radial-gradient(at 1% 96%, hsla(221,81%,65%,0.1) 0px, transparent 50%)`;

  return (
    <div class="relative grid h-screen place-items-center p-8" style={{ background: GRADIENT }}>
      <div class="flex h-full max-h-[720px] w-full max-w-[860px] flex-col justify-between gap-12 overflow-y-auto rounded-2xl border border-stroke/10 bg-regular-material p-8 shadow-2xl">
        <h1 class="pt-12 text-center text-2xl">Welcome to osu! radio</h1>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-text">Your osu! Songs folder</label>
            <div
              onClick={selectDir}
              class="flex items-baseline justify-between rounded-xl border border-white/5 bg-regular-material p-1 pl-4"
            >
              {" "}
              <span>{dir() === "" ? "[No folder selected]" : dir()}</span>{" "}
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  selectDir();
                }}
              >
                Select folder
              </Button>
            </div>
            <p class="pt-1 text-sm text-subtext">You can always change this in settings.</p>
          </div>
        </div>

        <div class="flex items-end justify-end">
          <Button size="large" onClick={submitDir}>
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
