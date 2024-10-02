import { Component, createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { isPlaying, next, previous, togglePlay } from "../../../lib/Music";
import { isSongUndefined } from "../../../lib/song";
import Fa from "solid-fa";
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faAdd,
  faRandom,
  faRepeat
} from "@fortawesome/free-solid-svg-icons";
import { GLOBAL_ICON_SCALE } from "../../../App";
import Bar from "../../bar/Bar";
import IconButton from "@renderer/components/icon-button/IconButton";
import { localVolume, setLocalVolume, song } from "@renderer/lib/state/song";

type SongControlsProps = {};

const SongControls: Component<SongControlsProps> = () => {
  const [disable, setDisable] = createSignal(isSongUndefined(song()));
  const [playHint, setPlayHint] = createSignal("");

  createEffect(() => {
    const disabled = disable();

    if (disabled) {
      setPlayHint("");
      return;
    }

    setPlayHint(isPlaying() ? "Pause" : "Play");
  });

  createEffect(() => setDisable(isSongUndefined(song())));

  return (
    <div class="song-controls">
      {/* Left part */}
      <div class="song-controls__left-part">
        <IconButton>
          <Switch>
            <Match when={localVolume() === 0}>
              <Fa icon={faVolumeXmark} scale={GLOBAL_ICON_SCALE} />
            </Match>
            <Match when={localVolume() < 0.5}>
              <Fa icon={faVolumeLow} scale={GLOBAL_ICON_SCALE} />
            </Match>
            <Match when={localVolume() >= 0.5}>
              <Fa icon={faVolumeHigh} scale={GLOBAL_ICON_SCALE} />
            </Match>
          </Switch>
        </IconButton>
        <div class="song-controls__volume-bar">
          <Bar fill={localVolume()} setFill={setLocalVolume} />
        </div>
      </div>

      {/* Middle */}
      <div class="song-controls__middle">
        <IconButton
          onClick={() => window.api.request("queue::shuffle")}
          disabled={disable()}
          title={"Play previous"}
        >
          <Fa icon={faRandom} scale={GLOBAL_ICON_SCALE} />
        </IconButton>
        <IconButton onClick={() => previous()} disabled={disable()} title={"Play previous"}>
          <Fa icon={faBackwardStep} scale={GLOBAL_ICON_SCALE} />
        </IconButton>

        <button
          class="song-controls__toggle-play"
          onClick={() => togglePlay()}
          disabled={disable()}
          title={playHint()}
        >
          <Show when={!isPlaying()} fallback={<Fa icon={faPause} scale={GLOBAL_ICON_SCALE} />}>
            <Fa icon={faPlay} scale={GLOBAL_ICON_SCALE} />
          </Show>
        </button>

        <IconButton onClick={() => next()} disabled={disable()} title={"Play next"}>
          <Fa icon={faForwardStep} scale={GLOBAL_ICON_SCALE} />
        </IconButton>

        <IconButton onClick={() => previous()} disabled={disable()} title={"Play previous"}>
          <Fa icon={faRepeat} scale={GLOBAL_ICON_SCALE} />
        </IconButton>
      </div>

      {/* Right part */}
      <div class="song-controls__right-part">
        <IconButton class="add-list">
          <Fa icon={faAdd} scale={GLOBAL_ICON_SCALE} />
        </IconButton>
      </div>
    </div>
  );
};

export default SongControls;
