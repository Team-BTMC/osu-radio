import { Song } from "@shared/types/common.types";
import SongContextMenuItem from "@renderer/components/song/context-menu/SongContextMenuItem";
import { PlusIcon } from "lucide-solid";
import { Component } from "solid-js";

type AddToPlaylistProps = {
  path: Song["path"] | undefined;
};

const AddToPlaylist: Component<AddToPlaylistProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={() => {
        if (props.path !== undefined && props.path !== "") {
          console.log("TODO: add " + props.path + " to playlist");
        }
      }}
    >
      <p>Add to Playlist</p>
      <PlusIcon size={20} />
    </SongContextMenuItem>
  );
};

export default AddToPlaylist;
