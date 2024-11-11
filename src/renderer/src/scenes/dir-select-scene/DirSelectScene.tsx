import osuLazerLogo from "@renderer/assets/osu-lazer-logo.png";
import osuStableLogo from "@renderer/assets/osu-stable-logo.png";
import Button from "@renderer/components/button/Button";
import { Accessor, createSignal, onMount, Setter } from "solid-js";
import { OsuDirectory } from "src/main/router/dir-router";
import { WindowControls } from "../main-scene/MainScene";
import "../main-scene/styles.css";

export default function DirSelectScene() {
  const [dirs, setDirs] = createSignal<OsuDirectory[]>([]);
  const [selectedDir, setSelectedDir] = createSignal<OsuDirectory>({ version: "none", path: "" });

  onMount(async () => {
    await autodetectDir();
  });

  const autodetectDir = async () => {
    const autoGetDir = await window.api.request("dir::autoGetOsuDirs");
    if (autoGetDir.isNone) {
      return;
    }

    setDirs(autoGetDir.value);
  };

  const selectDir = async () => {
    const opt = await window.api.request("dir::select");
    if (opt.isNone) {
      return;
    }

    setDirs((dirs) => [...dirs, opt.value]);
    setSelectedDir(opt.value);
  };

  const submitDir = async () => {
    if (selectedDir().version === "none") {
      return;
    }

    await window.api.request("dir::submit", selectedDir());
  };

  const [os, setOs] = createSignal<NodeJS.Platform>();

  onMount(async () => {
    const fetchOS = async () => {
      return await window.api.request("os::platform");
    };

    setOs(await fetchOS());
  });

  const GRADIENT = `radial-gradient(at 1% 75%, hsla(228,61%,67%,0.1) 0px, transparent 50%),
    radial-gradient(at 20% 56%, hsla(87,75%,61%,0.1) 0px, transparent 50%),
    radial-gradient(at 35% 34%, hsla(50,72%,67%,0.1) 0px, transparent 50%),
    radial-gradient(at 50% 18%, hsla(296,74%,62%,0.1) 0px, transparent 50%),
    radial-gradient(at 92% 14%, hsla(54,93%,75%,0.1) 0px, transparent 50%),
    radial-gradient(at 9% 83%, hsla(226,80%,64%,0.1) 0px, transparent 50%),
    radial-gradient(at 1% 96%, hsla(221,81%,65%,0.1) 0px, transparent 50%)`;

  return (
    <div class="relative grid h-screen place-items-center p-8" style={{ background: GRADIENT }}>
      <div
        class="absolute top-0 left-0 w-full h-[50px] flex items-center justify-end"
        style={{ "-webkit-app-region": "drag" }}
      >
        {os() !== "darwin" && <WindowControls />}
      </div>
      <div class="flex h-full max-h-[720px] w-full max-w-[860px] flex-col justify-between gap-12 overflow-y-auto rounded-2xl border border-stroke/10 bg-regular-material p-8 shadow-2xl">
        <h1 class="pt-12 text-center text-2xl">Welcome to osu! radio</h1>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-md font-bold text-text">Select an osu! installation:</label>
            {dirs().length > 0 ? (
              dirs().map((dir) => (
                <InstallationCard
                  directory={dir}
                  selectedDir={selectedDir}
                  setSelectedDir={setSelectedDir}
                />
              ))
            ) : (
              <p>No directories found</p>
            )}
            <div class="flex justify-between">
              <Button onClick={selectDir}>Select a different installation</Button>
              <p class="pt-1 text-sm text-subtext">You can always change this in settings.</p>
            </div>
          </div>
        </div>

        <div class="flex items-end justify-end">
          <Button
            size="large"
            disabled={selectedDir().version === "none" ? true : false}
            onClick={submitDir}
          >
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function InstallationCard(props: {
  directory: OsuDirectory;
  selectedDir: Accessor<OsuDirectory>;
  setSelectedDir: Setter<OsuDirectory>;
}) {
  return (
    <div
      class={`w-full rounded-xl border border-white/5 h-[72px] p-3 flex items-center select-none hover:cursor-pointer bg-[#333333] ${props.selectedDir() === props.directory ? "bg-[#333333]" : "bg-regular-material"}`}
      onClick={() => props.setSelectedDir(props.directory)}
    >
      <img
        src={props.directory.version === "stable" ? osuStableLogo : osuLazerLogo}
        class="w-[52px] h-[52px]"
        alt=""
      />
      <div class="flex flex-col pl-4 gap-1">
        <p class="font-bold">{props.directory.path}</p>
        <div class="flex items-center gap-3">
          <div
            class={`font-bold text-xs w-20 h-5 flex items-center justify-center rounded-full ${props.directory.version === "stable" ? "bg-pink-400" : "bg-teal-400"}`}
          >
            {props.directory.version.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
