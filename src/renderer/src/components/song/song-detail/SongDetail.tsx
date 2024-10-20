import formatTime from "../../../lib/time-formatter";
import SongImage from "../SongImage";
import SongControls from "./SongControls";
import Slider from "@renderer/components/slider/Slider";
import {
  seek,
  duration,
  song,
  timestamp,
  handleSeekStart,
  handleSeekEnd,
} from "@renderer/components/song/song.utils";
import { Component, createMemo, Show } from "solid-js";
import { useSongColor } from "../SongColor"; // Import the color hook

const SongDetail: Component = () => {
  const { averageColor, handleImageLoad } = useSongColor(); // Use the color hook

  return (
    <div class="flex h-full w-full max-w-[800px] flex-col p-8" style={{ "--dynamic-color": averageColor() }}>
      <div class="mb-8 grid flex-grow place-items-center">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="size-80 rounded-lg bg-cover bg-center object-cover shadow-lg"
          onImageLoad={handleImageLoad} // Pass the image load handler to SongImage
        />
      </div>

      <div class="w-full max-w-[800px] space-y-4">
        <div class="song-detail__texts">
          <h2 class="text-2xl font-bold">{song().title}</h2>
          <span class="text-lg">{song().artist}</span>
        </div>

        <ProgressBar averageColor={averageColor()} /> {/* Pass averageColor to ProgressBar */}
        <SongControls averageColor={averageColor()} /> {/* Pass averageColor to SongControls */}
      </div>
    </div>
  );
};

const ProgressBar = (props: { averageColor: string }) => {
  const currentValue = createMemo(() => {
    return timestamp() / (duration() !== 0 ? duration() : 1);
  });

  return (
    <Slider
      class="mt-4 block"
      min={0}
      max={1}
      value={currentValue}
      onValueChange={seek}
      onValueStart={handleSeekStart}
      onValueCommit={handleSeekEnd}
      animate
      style={{ "--bar-fill-color": props.averageColor }} // Use dynamic color for progress bar
    >
      <Slider.Track class="flex h-7 items-center rounded-xl bg-thick-material p-1">
        <Slider.Range class="block h-5 rounded-l-lg bg-surface" />
      </Slider.Track>
      <Slider.Thumb class="-mt-0.5 block h-8 w-1.5 rounded-lg bg-white" />
      <Slider.Time class="z-10 block px-3 pt-1.5 text-end text-[13px] font-bold">
        {formatTime(timestamp() * 1_000)}
      </Slider.Time>

      <Show when={currentValue() < 0.94}>
        <span class="pointer-events-none absolute right-0 top-0 z-10 block px-3 pt-1.5 text-end text-[13px]">
          {formatTime(duration() * 1_000)}
        </span>
      </Show>
    </Slider>
  );
};

export default SongDetail;
