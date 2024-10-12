import PlaylistList from "../playlist-list/PlaylistList";
import {
  PLAYLIST_SCENE_CREATE,
  PLAYLIST_SCENE_SONGS,
  PLAYLIST_SCENE_LIST,
  playlistActiveScene,
  setPlaylistActiveScene,
} from "./playlist-view.utils";
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
          <button onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}>
            create playlist, back (click me)
          </button>
        </Match>
        <Match when={playlistActiveScene() == PLAYLIST_SCENE_SONGS}>
          <button onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}>
            playlist song list, back (click me)
          </button>
        </Match>
      </Switch>
    </div>
  );
};

export default PlaylistView;
