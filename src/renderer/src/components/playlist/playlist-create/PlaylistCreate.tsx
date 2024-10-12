import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import { Component } from "solid-js";

export type PlaylistCreateProps = {};

const PlaylistCreate: Component<PlaylistCreateProps> = () => {
  return (
    <div>
      <button onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}>
        create playlist, back (click me)
      </button>
    </div>
  );
};

export default PlaylistCreate;
