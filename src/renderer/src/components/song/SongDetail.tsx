import "../../assets/css/song/song-detail.css";
import { duration, seek, song, timestamp } from "../../lib/Music";
import { isSongUndefined } from "../../lib/song";
import formatTime from "../../lib/time-formatter";
import Bar from "../Bar";
import SongControls from "./SongControls";
import SongImage from "./SongImage";
import { Component, createEffect, createSignal } from "solid-js";

type SongDetailProps = {};

const SongDetail: Component<SongDetailProps> = (_props) => {
  const [bg, setBg] = createSignal<string | undefined>();

  createEffect(() => {
    setBg(song.bg);
  });

  return (
    <div class="song-detail">
      <div class="song">
        <SongImage src={bg} instantLoad={true} />
        <h3>{song.title}</h3>
        <span>{song.artist}</span>
      </div>

      <div class="seeker">
        <Bar
          fill={timestamp() / (duration() !== 0 ? duration() : 1)}
          setFill={seek}
          disabled={isSongUndefined(song)}
        />
        <div class="time">
          <span>{formatTime(timestamp() * 1_000)}</span>
          <span>{formatTime(duration() * 1_000)}</span>
        </div>
      </div>

      <SongControls />
    </div>
  );
};

export default SongDetail;
