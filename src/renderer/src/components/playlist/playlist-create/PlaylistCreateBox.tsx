import Button from "@renderer/components/button/Button";
import { addNotice } from "@renderer/components/notice/NoticeContainer";
import SongImage from "@renderer/components/song/SongImage";
import Impulse from "@renderer/lib/Impulse";
import { BadgeCheckIcon, XIcon } from "lucide-solid";
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
    const name = playlistName().trim();
    if (name.length === 0 || name === undefined || name === "") {
      return;
    }
    window.api.request("playlist::create", name);
    setPlaylistName("");
    props.reset.pulse();
    props.isOpen(false);

    addNotice({
      title: "Playlist created",
      description: "The playlist " + name + " has been successfully created!",
      variant: "success",
      icon: <BadgeCheckIcon size={20} />,
    });
  };

  return (
    <div class="mb-6 rounded-xl bg-thick-material">
      <div class="flex flex-row items-center justify-between p-4">
        <h3 class="text-xl">Create a new playlist</h3>
        <Button variant={"ghost"} size={"icon"} onClick={() => props.isOpen(false)}>
          <XIcon />
        </Button>
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
