import { Component } from "solid-js";
import Bar from "../../bar/Bar";
import { seek, duration, song, timestamp } from "@renderer/components/song/song.utils";
import formatTime from "../../../lib/time-formatter";
import SongImage from "../SongImage";
import SongControls from "./SongControls";
import { isSongUndefined } from "../../../lib/song";
import { useSongColor } from "../SongColor";
import "./styles.css";

const SongDetail: Component = () => {
  const { averageColor, handleImageLoad } = useSongColor();

  // Helper function to convert hex to rgba
  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div class="song-detail">
      <div
        class="song-detail__song-bg"
        style={{
          "--box-shadow-color": hexToRgba(averageColor(), 0.32),
          "--dynamic-color": averageColor(),
        }}
      >
        {/* Pass the handleImageLoad function to SongImage */}
        {song().bg && (
          <SongImage src={song().bg} instantLoad={true} onImageLoad={handleImageLoad} />
        )}
      </div>

      <div class="song-detail__bottom-part">
        <div class="song-detail__texts">
          <h2 class="song-detail__title">{song().title}</h2>
          <span class="song-detail__artist"></span>
        </div>

        <Bar
          fill={timestamp() / (duration() !== 0 ? duration() : 1)}
          setFill={seek}
          disabled={isSongUndefined(song())}
          color={averageColor()}
        />
        <div class="song-detail__time">
          <span>
            {!isNaN(timestamp()) ? formatTime(timestamp() * 1_000) : "--:--"}
          </span>
          <span>
            {!isNaN(duration()) && duration() > 0
              ? formatTime(duration() * 1_000)
              : "--:--"}
          </span>
        </div>

        {/* Pass the averageColor to SongControls */}
        <SongControls averageColor={averageColor()} />
      </div>
    </div>
  );
};

export default SongDetail;
