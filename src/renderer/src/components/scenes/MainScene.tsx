import image from "../../assets/hololive IDOL PROJECT - BLUE CLAPPER_2761277.jpg";
import Bar from '../Bar';
import InfiniteScroller from '../InfiniteScroller';
import ResetSignal from '../../lib/ResetSignal';
import { Song } from '../../../../@types';
import Item from '../song/Item';



export default function MainScene() {
  const resetAllSongs = new ResetSignal();

  return (
    <div id="main" class="scene">
      <nav>
        <button class="icon" onClick={() => resetAllSongs.reset()}>Aa</button>
        <button class="icon">Aa</button>
        <button class="icon">Aa</button>
        <button class="icon">Aa</button>
        <button class="icon">Aa</button>
      </nav>

      <div class="side-pane">
        <div class="search">
          <h1>Search...</h1>
        </div>

        {/*todo add "Showing: 1,234 songs"*/}

        <InfiniteScroller class={"list"} apiKey={"allSongs"} reset={resetAllSongs} builder={(song: Song) =>
          <Item song={song}/>
        }/>
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