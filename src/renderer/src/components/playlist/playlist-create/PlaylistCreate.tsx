import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import "./styles.css";
import IconButton from "@renderer/components/icon-button/IconButton";
import { Component, createSignal } from "solid-js";

export type PlaylistCreateProps = {};

const PlaylistCreate: Component<PlaylistCreateProps> = () => {
  const [playlistName, setPlaylistName] = createSignal("");

  const createPlaylist = () => {
    // last check is probably unnecessary
    if (playlistName().length === 0 || playlistName() === undefined || playlistName() === "") {
      return;
    }
    window.api.request("playlist::create", playlistName().trim());
    setPlaylistActiveScene(PLAYLIST_SCENE_LIST);
    setPlaylistName("");
  };

  return (
    <div class="playlist-create">
      <div class="playlist-create__top">
        <div class="playlist-create__top__header">
          <IconButton onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}>
            <i class="ri-arrow-left-line"></i>
          </IconButton>
          <h3>New playlist</h3>
        </div>
        <div class="playlist-create__top__body">
          <p>Name</p>
          <input
            type="text"
            onInput={(e) => {
              setPlaylistName(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="playlist-create__footer">
        <button onClick={() => createPlaylist()}>Create</button>
      </div>
    </div>
  );
};

export default PlaylistCreate;
