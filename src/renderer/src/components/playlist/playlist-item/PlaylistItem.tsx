import IconButton from "../../icon-button/IconButton";
import SongImage from "../../song/SongImage";
import {
  PLAYLIST_SCENE_SONGS,
  setActivePlaylistName,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import "./styles.css";
import { Component } from "solid-js";
import { Playlist } from "src/@types";

type PlaylistItemProps = {
  playlist: Playlist;
  group: string;
};

// function formatPlaylistTime(seconds: number) {
//   let minutes = 0;
//   let hours = 0;
//   if (seconds > 60) {
//     minutes = Math.floor(seconds / 60);
//     if (minutes > 60) {
//       hours = Math.floor(minutes / 60);
//     }
//   }

//   return hours + " hours " + minutes + " minutes";
// }

function getSongImage(playlist: Playlist) {
  const songs = playlist.songs;
  if (songs.length === 0 || songs[0].bg === undefined || songs[0].bg === "") {
    return "";
  } else {
    return songs[0].bg;
  }
}

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
  return (
    <div
      class="playlist-item"
      onClick={() => {
        setActivePlaylistName(props.playlist.name);
        setPlaylistActiveScene(PLAYLIST_SCENE_SONGS);
      }}
    >
      <div class="playlist-item-container">
        <div class="playlist-item__playlist-img">
          <SongImage src={getSongImage(props.playlist)} group={props.group} />
        </div>

        <div class="playlist-item__playlist-info">
          <div class="playlist-item__playlist-info__text">
            <h3>{props.playlist.name}</h3>
            <p>{props.playlist.count} songs</p>
            {/* <p>{formatPlaylistTime(Math.round(props.playlist.length))}</p> */}
          </div>
          <div class="playlist-item__playlist-info__button">
            <IconButton onClick={() => window.api.request("playlist::delete", props.playlist.name)}>
              <i class="ri-delete-bin-7-fill" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
