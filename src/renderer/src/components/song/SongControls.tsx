import { Component, createEffect, createSignal, Match, Show, Switch } from 'solid-js';
import {
  isPlaying,
  localVolume,
  next,
  previous,
  setLocalVolume,
  setVolume,
  song,
  togglePlay,
  volume
} from '../../lib/Music';
import { isSongUndefined } from '../../lib/song';
import Fa from 'solid-fa';
import {
  faBackwardStep,
  faForwardStep,
  faGlobe,
  faLocationDot,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark
} from '@fortawesome/free-solid-svg-icons';
import { GLOBAL_ICON_SCALE } from '../../App';
import Bar from '../Bar';
import "../../assets/css/song/song-controls.css";



type SongControlsProps = {

}



const SongControls: Component<SongControlsProps> = () => {
  const [disable, setDisable] = createSignal(isSongUndefined(song));



  createEffect(() => setDisable(isSongUndefined(song)));



  return (
    <div class="controls">
      <div class="wrapper">
        <button class="icon" onClick={() => togglePlay()} disabled={disable()}>
          <Show when={!isPlaying()} fallback={<Fa icon={faPause} scale={GLOBAL_ICON_SCALE}/>}>
            <Fa icon={faPlay} scale={GLOBAL_ICON_SCALE}/>
          </Show>
        </button>
        <button class="icon" onClick={() => previous()} disabled={disable()}>
          <Fa icon={faBackwardStep} scale={GLOBAL_ICON_SCALE}/>
        </button>
        <button class="icon" onClick={() => next()} disabled={disable()}>
          <Fa icon={faForwardStep} scale={GLOBAL_ICON_SCALE}/>
        </button>
        <div class="dropdown" data-disabled={disable()}>
          <button class="icon" disabled={disable()}>
            <Switch>
              <Match when={volume() === 0}>
                <Fa icon={faVolumeXmark} scale={GLOBAL_ICON_SCALE}/>
              </Match>
              <Match when={volume() < 0.5}>
                <Fa icon={faVolumeLow} scale={GLOBAL_ICON_SCALE}/>
              </Match>
              <Match when={volume() >= 0.5}>
                <Fa icon={faVolumeHigh} scale={GLOBAL_ICON_SCALE}/>
              </Match>
            </Switch>
          </button>
          <div class="menu">
            <div class="menu-wrapper">
              <div class="selectors local" title={"Sets volume on current song"}>
                <Fa icon={faLocationDot} scale={GLOBAL_ICON_SCALE}/>
                <Bar fill={localVolume()} alignment="vertical" setFill={setLocalVolume}/>
              </div>

              <div class="selectors global" title={"Sets volume across the whole application"}>
                <Fa icon={faGlobe} scale={GLOBAL_ICON_SCALE}/>
                <Bar fill={volume()} alignment="vertical" setFill={setVolume}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default SongControls;