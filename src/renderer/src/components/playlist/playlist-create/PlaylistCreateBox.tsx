import { noticeError, setShowPlaylistCreateBox } from "../playlist.utils";
import Button from "@renderer/components/button/Button";
import { Input } from "@renderer/components/input/Input";
import { addNotice } from "@renderer/components/notice/NoticeContainer";
import SongImage from "@renderer/components/song/SongImage";
import Impulse from "@renderer/lib/Impulse";
import { CircleCheckIcon, XIcon } from "lucide-solid";
import { Component, createSignal, Signal } from "solid-js";
import { Song } from "src/@types";

export type PlaylistCreateBoxProps = {
  group: string;
  reset: Impulse;
  songSignal: Signal<Song | undefined>;
};
const PlaylistCreateBox: Component<PlaylistCreateBoxProps> = (props) => {
  const [playlistName, setPlaylistName] = createSignal("");
  const [createPlaylistBoxSong, setCreatePlaylistBoxSong] = props.songSignal;

  const createPlaylist = async () => {
    // last check is probably unnecessary
    const name = playlistName().trim();
    if (name.length === 0 || name === undefined || name === "") {
      return;
    }
    const result = await window.api.request("playlist::create", name);
    if (result.isError) {
      noticeError(result.error);
      return;
    }

    setPlaylistName("");
    props.reset.pulse();
    setShowPlaylistCreateBox(false);

    addNotice({
      title: "Playlist created",
      description: "The playlist " + name + " has been successfully created!",
      variant: "success",
      icon: <CircleCheckIcon size={20} />,
    });

    const song = createPlaylistBoxSong();
    if (song !== undefined) {
      const songResult = await window.api.request("playlist::add", name, song);
      setCreatePlaylistBoxSong(undefined);

      if (songResult.isError) {
        noticeError(songResult.error);
        return;
      }

      addNotice({
        title: "Song added",
        description: "Successfully added song to playlist " + name + "!",
        variant: "success",
        icon: <CircleCheckIcon size={20} />,
      });
    }
  };

  return (
    <div class="my-2 rounded-xl">
      <div class="flex flex-row items-center justify-between px-4 pb-2 pt-3">
        <h3 class="text-xl text-text">Create a new playlist</h3>
        <Button
          variant={"outlined"}
          size={"square"}
          onClick={() => setShowPlaylistCreateBox(false)}
        >
          <XIcon size={20} />
        </Button>
      </div>
      <div class="m-4 mt-0 flex flex-row">
        <div class="mr-4 flex items-center rounded-lg">
          <SongImage
            src={createPlaylistBoxSong()?.bg}
            group={props.group}
            instantLoad={true}
            class="h-[92px] w-[92px] rounded-lg bg-cover bg-center"
          />
        </div>
        <div class="flex w-full flex-col gap-3">
          <Input
            variant={"outlined"}
            type="text"
            placeholder="Playlist name"
            onInput={(e) => {
              setPlaylistName(e.target.value);
            }}
          />
          <Button
            class="cursor-pointer text-center"
            variant={"primary"}
            onClick={() => createPlaylist()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreateBox;
