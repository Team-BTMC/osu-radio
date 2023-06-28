import { createSignal } from 'solid-js';



export default function Scenes(props) {
  const [sceneID, setSceneID] = createSignal("");
  let id = 0;

  return (
    <div>
      {props.children.find(e => e.id === sceneID())}
      <button onClick={() => setSceneID("scene-" + (++id % 3))}>Switch</button>
    </div>
  );
}
