import { createSignal, onMount } from "solid-js";
import "./styles.css";
import Button from "@renderer/components/button/Button";

export default function DirSelectScene() {
  const [dir, setDir] = createSignal("");

  onMount(() => {
    autodetectDir();
  });

  const autodetectDir = async () => {
    // TODO: Fix me!
    const autoGetDir = await window.api.request("dir::autoGetOsuSongsDir");
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

  return (
    <div class="dir-select">
      <div class="dir-select__container">
        <h1 class="dir-select__title">Welcome to osu! radio</h1>

        <div class="select__select-folder-container">
          <div class="select__select-folder-input-container">
            <label class="select__select-folder-label">Your osu! Songs folder</label>
            <div onClick={selectDir} class="select__select-folder-input">
              {dir() === "" ? "[No folder selected]" : dir()}

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
            <p class="select__select-folder-hint">You can always change this in settings.</p>
          </div>
        </div>

        <div class="select__bottom-part">
          <Button size="large" onClick={submitDir}>
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
