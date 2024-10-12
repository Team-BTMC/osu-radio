import PlaylistCreate from "../playlist-create/PlaylistCreate";
import PlaylistList from "../playlist-list/PlaylistList";
import PlaylistSongList from "../playlist-song-list/PlaylistSongList";
import {
  PLAYLIST_SCENE_CREATE,
  PLAYLIST_SCENE_SONGS,
  PLAYLIST_SCENE_LIST,
  playlistActiveScene,
  activePlaylistName,
} from "./playlist-view.utils";
import "./styles.css";
import { Component, Match, Switch } from "solid-js";

export type PlaylistViewProps = {};

const PlaylistView: Component<PlaylistViewProps> = () => {
  return (
    <div class="playlist-view">
      <Switch fallback={<div>idk</div>}>
        <Match when={playlistActiveScene() == PLAYLIST_SCENE_LIST}>
          <PlaylistList />
        </Match>
        <Match when={playlistActiveScene() == PLAYLIST_SCENE_CREATE}>
          <PlaylistCreate />
        </Match>
        <Match when={playlistActiveScene() == PLAYLIST_SCENE_SONGS}>
          <PlaylistSongList playlistName={activePlaylistName()} />
        </Match>
      </Switch>
    </div>
  );
};

export default PlaylistView;
