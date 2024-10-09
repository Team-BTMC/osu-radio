import { Component } from "solid-js";
import SongImage from "../song/SongImage";

type PlaylistItemProps = {
  playlistName: string;
  group: string;
};

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
  return (
    <div class="song-item">
      <div class={"song-item-container"}>
        <SongImage
          src="/mnt/misc/progetti/osu-radio/src/renderer/src/assets/osu-default-background-small.jpg"
          group={props.group}
        />

        <div class="column">
          <h3>{props.playlistName}</h3>
          <p>727 songs</p>
          <p>7 hours 27 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
