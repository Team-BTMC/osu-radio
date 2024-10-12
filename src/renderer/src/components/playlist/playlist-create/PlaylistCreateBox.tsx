import SongImage from "@renderer/components/song/SongImage";
import Impulse from "@renderer/lib/Impulse";
import { Component, createSignal, Setter } from "solid-js";

export type PlaylistCreateBoxProps = {
  group: string;
  isOpen: Setter<boolean>;
  reset: Impulse;
};
const PlaylistCreateBox: Component<PlaylistCreateBoxProps> = (props) => {
  const [playlistName, setPlaylistName] = createSignal("");

  const createPlaylist = () => {
    // last check is probably unnecessary
    if (playlistName().length === 0 || playlistName() === undefined || playlistName() === "") {
      return;
    }
    window.api.request("playlist::create", playlistName().trim());
    setPlaylistName("");
    props.reset.pulse();
    props.isOpen(false);
  };

  return (
    <div class="playlist-create-box">
      <div class="playlist-create-box__header">
        <h3>Create a new playlist</h3>
        <button onClick={() => props.isOpen(false)}>
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="playlist-create-box__body">
        <div class="playlist-create-box__body__image">
          <SongImage src={""} group={props.group} instantLoad={true} />
        </div>
        <div class="playlist-create-box__body__input">
          <input
            type="text"
            placeholder="Playlist name"
            onInput={(e) => {
              setPlaylistName(e.target.value);
            }}
          />
          <button onClick={() => createPlaylist()}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreateBox;
