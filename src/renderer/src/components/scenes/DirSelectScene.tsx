import { createSignal } from 'solid-js';



export default function DirSelectScene() {
  const [dir, setDir] = createSignal("")

  const selectDir = async () => {
    const opt = await window.api.request("dirSelect");
    if (opt.isNone) {
      return;
    }

    setDir(opt.value);
  }

  const submitDir = async () => {
    await window.api.request("dirSubmit", dir());
  }

  return (
    <>
      <div class="center column">
        <button onClick={selectDir}>Select your osu! Songs directory</button>
        <h3><code>{dir()}</code></h3>
        <button onClick={submitDir}>Submit</button>
      </div>
    </>
  );
}
