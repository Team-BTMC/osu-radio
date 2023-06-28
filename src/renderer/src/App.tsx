import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import Gradient from './components/Gradient';
import MainScene from './components/scenes/MainScene';
import SceneSwitcher from './components/SceneSwitcher';
import DirSelectScene from './components/scenes/DirSelectScene';



export default function App(): JSX.Element {
  const [topColor, setTopColor] = createSignal('dodgerblue');

  onMount(() => {
    window.addEventListener('click', () => {
      setTopColor('dodgerblue');
    });
  });

  return (
    <Gradient bottomColor='crimson' topColor={topColor()}>
      <SceneSwitcher>
        <div id="dir-select" class="scene">
          <DirSelectScene />
        </div>

        <div id="main" class="scene">
          <MainScene />
        </div>
      </SceneSwitcher>
    </Gradient>
  );
}
