import { addNotice } from "@renderer/components/notice/NoticeContainer";
import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { Component } from "solid-js";
import { BadgeCheckIcon, PlusIcon } from "lucide-solid";
import { noticeError } from "@renderer/components/playlist/playlist.utils";

type AddToPlaylistProps = {
  song: Song;
};

const AddToPlaylist: Component<AddToPlaylistProps> = (props) => {
  const addToPlaylist = async () => {
    const result = await window.api.request("playlist::add", "test", props.song);
    if (result.isError) {
      noticeError(result.error);
      return;
    }
    addNotice({
      title: "Song added",
      description: "Successfully added song to playlist!",
      variant: "success",
      icon: <BadgeCheckIcon size={20} />,
    });
  };

  return (
    <SongContextMenuItem
      onClick={() => {
        addToPlaylist();
      }}
    >
      <p>Add to Playlist</p>
      <PlusIcon />
    </SongContextMenuItem>
  );
};

export default AddToPlaylist;
