import PlaylistList from "../playlist-list/PlaylistList";
import PlaylistSongList from "../playlist-song-list/PlaylistSongList";
import {
  PLAYLIST_SCENE_SONGS,
  PLAYLIST_SCENE_LIST,
  playlistActiveScene,
  activePlaylistName,
} from "../playlist.utils";
import { Component, Match, Switch } from "solid-js";

const PlaylistView: Component = () => {
  return (
    <div class="h-full overflow-y-auto">
      <Switch>
        <Match when={playlistActiveScene() == PLAYLIST_SCENE_LIST}>
          <PlaylistList />
        </Match>
        <Match when={playlistActiveScene() == PLAYLIST_SCENE_SONGS}>
          <PlaylistSongList playlistName={activePlaylistName()} />
        </Match>
      </Switch>
    </div>
  );
};

export default PlaylistView;
