import { createSignal } from "solid-js";
import "./styles.css";
import Button from "@renderer/components/button/Button";

export default function DirSelectScene() {
  const [dir, setDir] = createSignal("");

  const selectDir = async () => {
    const opt = await window.api.request("dir::select");
    if (opt.isNone) {
      return;
    }

    setDir(opt.value);
  };

  const autodetectDir = async () => {
    const autoGetDir = await window.api.request("dir::autoGetOsuSongsDir");
    if (autoGetDir.isNone) {
      return;
    }

    setDir(autoGetDir.value);
  };

  const submitDir = async () => {
    await window.api.request("dir::submit", dir());
  };

  return (
    <div class="dir-select">
      <div class="dir-select__container">
        <h1 class="dir-select__title">Welcome to osu! radio</h1>

        <div class="select__select-folder-container">
          <div class="select__select-folder-input-container">
            <label class="select__select-folder-label">Your osu! Songs folder</label>
            <button
              onClick={selectDir}
              class="select__select-folder-input"
              classList={{ empty: !Boolean(dir()) }}
            >
              {dir() === "" ? "[No folder selected]" : dir()}
            </button>
          </div>
          <div class="select__select-folder-actions">
            <Button variant="secondary" onClick={autodetectDir}>
              Autodetect folder
            </Button>
            <Button variant="secondary" onClick={selectDir}>
              Select folder
            </Button>
          </div>
        </div>

        <div class="select__bottom-part">
          <p class="select__bottom-part-warning">You can always change this in settings.</p>
          <Button size="large" onClick={submitDir}>
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
