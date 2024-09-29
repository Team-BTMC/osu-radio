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
  const [playHint, setPlayHint] = createSignal("");

  createEffect(() => {
    const disabled = disable();

    if (disabled) {
      setPlayHint("");
      return;
    }

    setPlayHint(isPlaying() ? "Pause" : "Play");
  });

  createEffect(() => setDisable(isSongUndefined(song)));

  return (
    <div class="controls">
      <div class="wrapper">
        <button class="icon hint" onClick={() => previous()} disabled={disable()} title={'Play previous'}>
          <Fa icon={faBackwardStep} scale={GLOBAL_ICON_SCALE}/>
        </button>
        <button class="icon hint" onClick={() => togglePlay()} disabled={disable()} title={playHint()}>
          <Show when={!isPlaying()} fallback={<Fa icon={faPause} scale={GLOBAL_ICON_SCALE}/>}>
            <Fa icon={faPlay} scale={GLOBAL_ICON_SCALE}/>
          </Show>
        </button>
        <button class="icon hint" onClick={() => next()} disabled={disable()} title={'Play next'}>
          <Fa icon={faForwardStep} scale={GLOBAL_ICON_SCALE}/>
        </button>
        <div class="dropdown" data-disabled={disable()}>
          <button class="icon hint" disabled={disable()} title={"Manage song/global volume"}>
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
              <div class="selectors local hint" title={"Sets volume on current song"}>
                <Fa icon={faLocationDot} scale={GLOBAL_ICON_SCALE}/>
                <Bar fill={localVolume()} alignment="vertical" setFill={setLocalVolume}/>
              </div>

              <div class="selectors global hint" title={"Sets volume across the whole application"}>
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