import image from "../../assets/hololive IDOL PROJECT - BLUE CLAPPER_2761277.jpg";
import Bar from '../Bar';
import SongView from '../song/SongView';
import { createEffect, createSignal, onMount } from 'solid-js';
import Fa from 'solid-fa';
import { faGear, faListUl, faMusic } from '@fortawesome/free-solid-svg-icons';
import { globalIconScale } from '../../App';



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
          <Fa icon={faListUl} scale={globalIconScale}/>
        </button>
        <button class="icon" onClick={() => setActive(2)}>
          <Fa icon={faGear} scale={globalIconScale}/>
        </button>
      </nav>

      <div class="side-pane" ref={sidePane}>
        <SongView isAllSongs={true}/>
        <div>Playlists</div>
        <div>Settings</div>
      </div>

      <main class="center">
        <div class="container">
          <div class="song">
            <img src={image} alt="art" />
            <h3>BLUE CLAPPER</h3>
            <span>hololive IDOL PROJECT</span>
          </div>

          <div class="seeker">
            <Bar fill={0.1}/>
            <div class="time">
              <span class="currently">0:01:09</span><span class="duration">0:04:20</span>
            </div>
          </div>

          <div class="controls">
            <div class="wrapper">
              <button class="icon"><span>||</span></button>
              <button class="icon"><span>|&lt;</span></button>
              <button class="icon"><span>&gt;|</span></button>
              <div class="dropdown">
                <button class="icon"><span>Vol</span></button>
                <div class="menu">
                  <div class="menu-wrapper">
                    <div class="selectors local">
                      <span>Local</span>
                      <Bar fill={0.1} alignment="vertical"/>
                    </div>

                    <div class="selectors global">
                      <span>Global</span>
                      <Bar fill={0.1} alignment="vertical"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}