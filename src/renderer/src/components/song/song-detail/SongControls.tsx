import { isSongUndefined } from "../../../lib/song";
import Bar from "../../bar/Bar";
import {
  isPlaying,
  next,
  previous,
  togglePlay,
  localVolume,
  setLocalVolume,
  song,
} from "../song.utils";
import IconButton from "@renderer/components/icon-button/IconButton";
import { Component, createEffect, createSignal, Match, Show, Switch } from "solid-js";

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
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <IconButton class="text-text-700">
          <Switch>
            <Match when={localVolume() === 0}>
              <i class="ri-volume-mute-fill" />
            </Match>
            <Match when={localVolume() < 0.5}>
              <i class="ri-volume-down-fill" />
            </Match>
            <Match when={localVolume() >= 0.5}>
              <i class="ri-volume-up-fill" />
            </Match>
          </Switch>
        </IconButton>
        <div class="w-24 ml-3">
          <Bar fill={localVolume()} setFill={setLocalVolume} />
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <IconButton
          onClick={() => window.api.request("queue::shuffle")}
          disabled={disable()}
          title="Shuffle"
        >
          <i class="ri-shuffle-fill" />
        </IconButton>
        <IconButton onClick={() => previous()} disabled={disable()} title="Play previous">
          <i class="ri-skip-back-mini-fill" />
        </IconButton>

        <button
          class="w-12 h-12 flex items-center justify-center bg-accent rounded-full text-2xl"
          onClick={() => togglePlay()}
          disabled={disable()}
          title={playHint()}
        >
          <Show when={!isPlaying()} fallback={<i class="ri-pause-fill" />}>
            <i class="ri-play-fill" />
          </Show>
        </button>

        <IconButton onClick={() => next()} disabled={disable()} title="Play next">
          <i class="ri-skip-forward-mini-fill"></i>
        </IconButton>

        <IconButton
          onClick={() => {
            // TODO - implement repeat
          }}
          disabled={disable()}
          title="Repeat"
        >
          <i class="ri-repeat-2-fill" />
        </IconButton>
      </div>

      <div>
        <IconButton>
          <i class="ri-add-fill" />
        </IconButton>
      </div>
    </div>
  );
};

export default SongControls;