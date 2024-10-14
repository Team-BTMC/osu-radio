import formatTime from "../../../lib/time-formatter";
import SongImage from "../SongImage";
import SongControls from "./SongControls";
import "./styles.css";
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

const SongDetail: Component = () => {
  return (
    <div class="flex h-full w-full max-w-[800px] flex-col p-8">
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

        <ProgressBar />
        <SongControls />
      </div>
    </div>
  );
};

const ProgressBar = () => {
  const currentValue = createMemo(() => {
    return timestamp() / (duration() !== 0 ? duration() : 1);
  });

  return (
    <Slider
      class="block mt-4"
      min={0}
      max={1}
      value={currentValue}
      onValueChange={seek}
      onValueStart={handleSeekStart}
      onValueCommit={handleSeekEnd}
      animate
    >
      <Slider.Track class="flex items-center p-1 h-7 bg-thick-material rounded-xl">
        <Slider.Range class="block h-5 bg-surface rounded-l-lg" />
      </Slider.Track>
      <Slider.Thumb class="-mt-0.5 block w-1.5 h-8 bg-white rounded-lg" />
      <Slider.Time class="block pt-1.5 px-3 text-[13px] font-bold text-end z-10">
        {formatTime(timestamp() * 1_000)}
      </Slider.Time>

      <Show when={currentValue() < 0.94}>
        <span class="absolute top-0 right-0 block pt-1.5 px-3 text-[13px] text-end z-10">
          {formatTime(duration() * 1_000)}
        </span>
      </Show>
    </Slider>
  );
};

export default SongDetail;
