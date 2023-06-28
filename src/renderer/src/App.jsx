import { createSignal, onMount } from 'solid-js';
import Gradient from './components/Gradient';
import MainScene from './components/scenes/MainScene';
import Scenes from './components/Scenes';
import DirSelectScene from './components/scenes/DirSelectScene';
export default function App() {
    const [topColor, setTopColor] = createSignal('dodgerblue');
    onMount(() => {
        window.addEventListener('click', () => {
            setTopColor('dodgerblue');
        });
    });
    return (<Gradient bottomColor='crimson' topColor={topColor()}>
      <Scenes>
        <DirSelectScene />
        <MainScene />
      </Scenes>
    </Gradient>);
}
