import { Component } from "solid-js";
import SongImage from "../../song/SongImage";
import { Playlist } from "src/@types";
import IconButton from "../../icon-button/IconButton";

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
      style="margin-bottom: 5px; border: 1px solid white;"
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
          <IconButton onClick={()=>window.api.request("playlist::delete", props.playlist.name)}>
            <i class="ri-delete-bin-7-fill" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
