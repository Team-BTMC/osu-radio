import { isSongUndefined } from "../../../lib/song";
import formatTime from "../../../lib/time-formatter";
import Bar from "../../bar/Bar";
import SongImage from "../SongImage";
import SongControls from "./SongControls";
import "./styles.css";
import { seek, duration, song, timestamp } from "@renderer/components/song/song.utils";
import { Component } from "solid-js";

const SongDetail: Component = () => {
  return (
    <div class="flex flex-col h-full p-8 max-w-2xl w-full">
      <div class="flex-grow mb-8 grid place-items-center">
        <SongImage src={song().bg} instantLoad={true} class="size-80 bg-cover bg-center object-cover rounded-lg shadow-lg" />
      </div>

      <div class="space-y-4">
        <div class="text-center">
          <h2 class="text-2xl font-bold">{song().title}</h2>
          <span class="text-lg text-text-700">{song().artist}</span>
        </div>

        <Bar
          fill={timestamp() / (duration() !== 0 ? duration() : 1)}
          setFill={seek}
          disabled={isSongUndefined(song())}
        />
        <div class="flex justify-between text-sm">
          <span>{formatTime(timestamp() * 1_000)}</span>
          <span>{formatTime(duration() * 1_000)}</span>
        </div>

        <SongControls />
      </div>
    </div>
  );
};

export default SongDetail;
