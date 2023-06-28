import { createSignal } from 'solid-js';



export function DirSelectScene() {
  const [dir, setDir] = createSignal("")

  const selectDir = async () => {
    setDir(await window.api.request("dirSelect"));
  }

  const submitDir = async () => {
    await window.api.request("dirSubmit", dir());
  }

  return (
    <div id="dir-select">
      <div class="center column">
        <button onClick={selectDir}>Select your osu! Songs directory</button>
        <h3><code>{dir()}</code></h3>
        <button onClick={submitDir}>Submit</button>
      </div>
    </div>
  );
}
