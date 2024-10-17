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
import Button from "@renderer/components/button/Button";
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
        <Button variant={"ghost"} size="icon">
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
        </Button>
        <div class="ml-3 w-24 opacity-0 transition-opacity group-hover:opacity-100">
          <Bar fill={localVolume()} setFill={setLocalVolume} />
        </div>
      </div>
      <div class="col-span-2 col-start-2 flex items-center justify-center gap-4">
        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => window.api.request("queue::shuffle")}
          disabled={disable()}
          title="Shuffle"
        >
          <i class="ri-shuffle-fill" />
        </Button>
        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => previous()}
          disabled={disable()}
          title="Play previous"
        >
          <i class="ri-skip-back-mini-fill" />
        </Button>

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

        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => next()}
          disabled={disable()}
          title="Play next"
        >
          <i class="ri-skip-forward-mini-fill"></i>
        </Button>

        <Button
          variant={"ghost"}
          class=""
          size="icon"
          onClick={() => {
            // TODO - implement repeat
          }}
          disabled={disable()}
          title="Repeat"
        >
          <i class="ri-repeat-2-fill" />
        </Button>
      </div>
      <div class="ml-auto">
        <Button variant="ghost" size="icon">
          <i class="ri-add-fill" />
        </Button>
      </div>
    </div>
  );
};

export default SongControls;
