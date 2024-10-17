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
import {
  CirclePlusIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-solid";
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
              <VolumeXIcon size={20} />
            </Match>
            <Match when={localVolume() < 0.5}>
              <Volume1Icon size={20} />
            </Match>
            <Match when={localVolume() >= 0.5}>
              <Volume2Icon size={20} />
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
          <ShuffleIcon size={20} />
        </Button>
        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => previous()}
          disabled={disable()}
          title="Play previous"
        >
          <SkipBackIcon size={20} />
        </Button>

        <button
          class="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-2xl text-thick-material"
          onClick={() => togglePlay()}
          disabled={disable()}
          title={playHint()}
        >
          <Show when={!isPlaying()} fallback={<PauseIcon fill="currentColor" size={20} />}>
            <PlayIcon fill="currentColor" size={20} />
          </Show>
        </button>

        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => next()}
          disabled={disable()}
          title="Play next"
        >
          <SkipForwardIcon size={20} />
        </Button>

        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => {
            // TODO - implement repeat
          }}
          disabled={disable()}
          title="Repeat"
        >
          <RepeatIcon size={20} />
        </Button>
      </div>
      <div class="ml-auto">
        <Button variant="ghost" size="icon">
          <CirclePlusIcon size={20} />
        </Button>
      </div>
    </div>
  );
};

export default SongControls;
