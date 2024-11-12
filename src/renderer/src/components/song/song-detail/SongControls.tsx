import { isSongUndefined } from "../../../lib/song";
import {
  isPlaying,
  next,
  previous,
  togglePlay,
  song,
  setVolume,
  volume,
  handleMuteSong,
} from "../song.utils";
import Button from "@renderer/components/button/Button";
import Slider from "@renderer/components/slider/Slider";
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

// Add a prop to accept the averageColor
type SongControlsProps = {
  averageColor?: string;
};

const SongControls: Component<SongControlsProps> = (props) => {
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
    <div class="flex w-full items-center gap-4" style={{ "--dynamic-color": props.averageColor }}>
      <LeftPart />
      <div class="flex flex-1 items-center justify-center gap-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => window.api.request("queue::shuffle")}
          disabled={disable()}
          title="Shuffle"
        >
          <ShuffleIcon size={20} />
        </Button>

        <div class="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => previous()}
            disabled={disable()}
            title="Play previous"
          >
            <SkipBackIcon size={20} />
          </Button>

          <button
            class="flex h-12 w-12 items-center justify-center rounded-full border border-solid border-stroke bg-surface text-2xl text-thick-material text-white shadow-lg"
            onClick={() => togglePlay()}
            disabled={disable()}
            title={playHint()}
            style={{
              "background-color": props.averageColor, // Use the average color as background
            }}
          >
            <Show when={!isPlaying()} fallback={<PauseIcon fill="white" size={20} />}>
              <PlayIcon fill="white" size={20} />
            </Show>
          </button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => next()}
            disabled={disable()}
            title="Play next"
          >
            <SkipForwardIcon size={20} />
          </Button>
        </div>

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
      <RightPart />
    </div>
  );
};

// LeftPart component updated to include averageColor prop for styling
const LeftPart = () => {
  const [isHoveringVolume, setIsHoveringVolume] = createSignal(false);
  let isHoverintTimeoutId: NodeJS.Timeout;

  return (
    <div class="flex-1">
      <div
        class="group flex w-max items-center gap-4"
        onMouseEnter={() => {
          clearTimeout(isHoverintTimeoutId);
          setIsHoveringVolume(true);
        }}
        onMouseLeave={() => {
          isHoverintTimeoutId = setTimeout(() => {
            setIsHoveringVolume(false);
          }, 320);
        }}
      >
        <Button size="icon" variant="ghost" onClick={handleMuteSong}>
          <Switch>
            <Match when={volume() === 0}>
              <VolumeXIcon size={20} />
            </Match>
            <Match when={volume() < 0.5}>
              <Volume1Icon size={20} />
            </Match>
            <Match when={volume() >= 0.5}>
              <Volume2Icon size={20} />
            </Match>
          </Switch>
        </Button>

        <Show when={isHoveringVolume()}>
          <Slider
            class="flex h-8 w-28 flex-grow items-center"
            min={0}
            max={1}
            value={volume}
            onValueChange={setVolume}
            enableWheelSlide
          >
            <Slider.Track class="h-1 flex-1 rounded bg-thick-material ring-1 ring-stroke">
              <Slider.Range class="block h-1 rounded bg-white" />
            </Slider.Track>
            <Slider.Thumb class="mt-2 block h-4 w-4 rounded-full bg-white" />
          </Slider>
        </Show>
      </div>
    </div>
  );
};

const RightPart = () => {
  return (
    <div class="flex flex-1 justify-end">
      <Button size="icon" variant="ghost">
        <CirclePlusIcon size={20} />
      </Button>
    </div>
  );
};

export default SongControls;
