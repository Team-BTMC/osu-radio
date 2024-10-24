import { Component, createMemo } from "solid-js";
import { useColorExtractor } from "../colorExtractor";
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
import { Show } from "solid-js";
import { darken } from "polished"; // Import darken from polished

const SongDetail: Component = () => {
  const { extractColorFromImage } = useColorExtractor();

  // Get the songColor and borderColor from the Accessor returned by extractColorFromImage
  const colorData = createMemo(() => extractColorFromImage(song()));

  // Darken the border color by 50% using polished's darken function
  const darkenedBorderColor = createMemo(() =>
    darken(0.15, colorData().borderColor() || "gray")
  );

  return (
    <div
      class="flex h-full w-full max-w-[800px] flex-col p-8"
      style={{
        "--dynamic-color": colorData().songColor() || "white", // Use the extracted song color
        "border-color": darkenedBorderColor(),  // Use the darkened border color
      }}
    >
      <div class="mb-8 grid flex-grow place-items-center">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="size-80 rounded-lg bg-cover bg-center object-cover shadow-lg"
        />
      </div>

      <div class="w-full max-w-[800px] space-y-4">
        <div class="song-detail__texts">
          <h2 class="text-2xl font-bold">{song().title}</h2>
          <span class="text-lg">{song().artist}</span>
        </div>

        {/* Pass the reactive songColor and darkened borderColor to the ProgressBar */}
        <ProgressBar
          averageColor={colorData().songColor() || "white"}
          borderColor={darkenedBorderColor()}
        />
        <SongControls averageColor={colorData().songColor() || "white"} />
      </div>
    </div>
  );
};

const ProgressBar = (props: { averageColor: string, borderColor: string }) => {
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
    >
      <Slider.Track
        class="flex h-7 items-center rounded-xl p-1 bg-zinc-900"
        //style={{ "background-color": props.borderColor }} // Apply the darkened border color from props
      >
        <Slider.Range
          class="block h-5 rounded-l-lg"
          style={{ "background-color": props.averageColor }} // Apply the average color only to the Range
        />
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
