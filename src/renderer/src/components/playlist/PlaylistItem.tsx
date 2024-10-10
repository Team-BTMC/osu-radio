import { Component } from "solid-js";
import SongImage from "../song/SongImage";
import { Playlist } from "src/@types";

type PlaylistItemProps = {
  playlist: Playlist;
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
          <h3>{props.playlist.name}</h3>
          <p>{props.playlist.count} songs</p>
          <p>{props.playlist.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
