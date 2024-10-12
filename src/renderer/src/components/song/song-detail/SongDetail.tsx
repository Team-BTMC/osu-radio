import { isSongUndefined } from "../../../lib/song";
import formatTime from "../../../lib/time-formatter";
import Bar from "../../bar/Bar";
import SongImage from "../SongImage";
import SongControls from "./SongControls";
import { seek, duration, song, timestamp } from "@renderer/components/song/song.utils";
import { Component } from "solid-js";

const SongDetail: Component = () => {
  return (
    <div class="flex h-full w-full max-w-[680px] flex-col p-8">
      <div class="mb-8 grid flex-grow place-items-center">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="size-80 rounded-lg bg-cover bg-center object-cover shadow-lg"
        />
      </div>

      <div class="w-full max-w-[680px] space-y-4">
        <h2 class="text-2xl font-bold">{song().title}</h2>
        <span class="text-lg">{song().artist}</span>
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
