import { Component } from "solid-js";
import SongImage from "../song/SongImage";
import { Playlist } from "src/@types";

type PlaylistItemProps = {
  playlist: Playlist;
  group: string;
};

function formatPlaylistTime(seconds: number) {
  let minutes = 0;
  let hours = 0;
  if (seconds > 60) {
    minutes = Math.floor(seconds / 60);
    if (minutes > 60) {
      hours = Math.floor(minutes / 60);
    }
  }

  return hours + " hours " + minutes + " minutes";
}

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
  return (
    <div
      class="song-item"
      onClick={() => {
        console.log(props.playlist.songs);
      }}
    >
      <div class={"song-item-container"}>
        <SongImage
          src="/mnt/misc/progetti/osu-radio/src/renderer/src/assets/osu-default-background-small.jpg"
          group={props.group}
        />

        <div class="column">
          <h3>{props.playlist.name}</h3>
          <p>{props.playlist.count} songs</p>
          <p>{formatPlaylistTime(Math.round(props.playlist.length))}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
