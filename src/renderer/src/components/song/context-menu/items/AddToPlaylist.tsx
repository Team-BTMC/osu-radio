import { addNotice } from "@renderer/components/notice/NoticeContainer";
import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { Component, createSignal, Show } from "solid-js";
import { BadgeCheckIcon } from "lucide-solid";

type SongAddToPlaylistNextProps = {
  song: Song;
};

const AddToPlaylist: Component<SongAddToPlaylistNextProps> = (props) => {
  const [show, setShow] = createSignal(false);

  window.api.listen("queue::created", () => {
    setShow(true);
  });

  window.api.listen("queue::destroyed", () => {
    setShow(false);
  });

  const addToPlaylist = () => {
    window.api.request("playlist::add", "test", props.song);
    addNotice({
      title: "Song added",
      description: "Successfully added song to playlist!",
      variant: "success",
      icon: <BadgeCheckIcon size={20} />,
    });
  };

  return (
    <Show when={show()}>
      <SongContextMenuItem onClick={() => addToPlaylist()}>Add to Playlist</SongContextMenuItem>
    </Show>
  );
};

export default AddToPlaylist;
