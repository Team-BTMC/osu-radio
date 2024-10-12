import IconButton from "../../icon-button/IconButton";
import SongImage from "../../song/SongImage";
import {
  PLAYLIST_SCENE_SONGS,
  setActivePlaylistName,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import { deletePlaylist, getSongImage } from "./playlist-item.utils";
import "./styles.css";
import Impulse from "@renderer/lib/Impulse";
import { Component } from "solid-js";
import { Playlist } from "src/@types";

export type PlaylistItemProps = {
  playlist: Playlist;
  group: string;
  reset: Impulse;
};

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
            <IconButton onClick={(e) => deletePlaylist(e, props)}>
              <i class="ri-more-2-line" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
