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

const SongControls: Component = () => {
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
    <div class="grid w-full grid-cols-4 items-center gap-4">
      <div class="group flex w-max items-center">
        <IconButton class="text-text">
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
        <div class="ml-3 w-24 opacity-0 transition-opacity group-hover:opacity-100">
          <Bar fill={localVolume()} setFill={setLocalVolume} />
        </div>
      </div>
      <div class="col-span-2 col-start-2 flex items-center justify-center gap-4">
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
          class="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-2xl text-thick-material"
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
      <div class="ml-auto">
        <IconButton>
          <i class="ri-add-fill" />
        </IconButton>
      </div>
    </div>
  );
};

export default SongControls;
