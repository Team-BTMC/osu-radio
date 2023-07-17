import SongView from '../song/SongView';
import { createEffect, createSignal, onMount } from 'solid-js';
import Fa from 'solid-fa';
import { faGear, faHeadphonesSimple, faListUl, faMusic } from '@fortawesome/free-solid-svg-icons';
import { globalIconScale } from '../../App';
import SongDetail from '../song/SongDetail';



export default function MainScene() {
  const [active, setActive] = createSignal(0);
  let sidePane;

  onMount(() => {
    createEffect(() => {
      sidePane.children[active()]?.scrollIntoView();
    });
  });

  return (
    <div id="main" class="scene">
      <nav>
        <button class="icon" onClick={() => setActive(0)}>
          <Fa icon={faMusic} scale={globalIconScale}/>
        </button>
        <button class="icon" onClick={() => setActive(1)}>
          <Fa icon={faHeadphonesSimple} scale={globalIconScale}/>
        </button>
        <button class="icon" onClick={() => setActive(2)}>
          <Fa icon={faListUl} scale={globalIconScale}/>
        </button>
        <button class="icon" onClick={() => setActive(3)}>
          <Fa icon={faGear} scale={globalIconScale}/>
        </button>
      </nav>

      <div class="side-pane" ref={sidePane}>
        <SongView isAllSongs={true}/>
        <div>Queue</div>
        <div>Playlists</div>
        <div>Settings</div>
      </div>

      <main class="center">
        <SongDetail/>
      </main>
    </div>
  );
}