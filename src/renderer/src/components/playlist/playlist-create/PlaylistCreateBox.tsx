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
    <div class="mb-6 rounded-xl bg-thick-material">
      <div class="flex flex-row justify-between p-4">
        <h3>Create a new playlist</h3>
        <button onClick={() => props.isOpen(false)} class="text-xl">
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="m-4 mt-0 flex flex-row">
        <div class="mr-4 rounded-lg">
          <SongImage
            src={""}
            group={props.group}
            instantLoad={true}
            class="h-[83px] w-[83px] rounded-lg bg-cover bg-center"
          />
        </div>
        <div class="flex w-full flex-col gap-3">
          <input
            type="text"
            placeholder="Playlist name"
            class="h-9 w-full rounded-lg border-none bg-surface py-[10px] pl-4 font-[inherit] text-base font-normal text-accent"
            onInput={(e) => {
              setPlaylistName(e.target.value);
            }}
          />
          <button
            class="mb-6 flex h-9 w-full flex-row items-center justify-center rounded-lg bg-accent font-semibold text-black"
            onClick={() => createPlaylist()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreateBox;
