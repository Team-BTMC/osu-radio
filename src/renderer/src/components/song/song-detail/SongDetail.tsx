import { Component } from "solid-js";
import Bar from "../../bar/Bar";
import { seek } from "../../../lib/Music";
import formatTime from "../../../lib/time-formatter";
import SongImage from "../SongImage";
import SongControls from "./SongControls";
import { isSongUndefined } from "../../../lib/song";
import { duration, song, timestamp } from "@renderer/lib/state/song";
import "./styles.css";

const SongDetail: Component = () => {
  return (
    <div class="song-detail">
      <div class="song-detail__song-bg">
        <SongImage src={song().bg} instantLoad={true} />
      </div>

      <div class="song-detail__bottom-part">
        <div class="song-detail__texts">
          <h2 class="song-detail__title">{song().title}</h2>
          <span class="song-detail__artist">{song().artist}</span>
        </div>

        <Bar
          fill={timestamp() / (duration() !== 0 ? duration() : 1)}
          setFill={seek}
          disabled={isSongUndefined(song())}
        />
        <div class="song-detail__time">
          <span>{formatTime(timestamp() * 1_000)}</span>
          <span>{formatTime(duration() * 1_000)}</span>
        </div>

        <SongControls />
      </div>
    </div>
  );
};

export default SongDetail;
