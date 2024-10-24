import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
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
      <PlusIcon />
    </SongContextMenuItem>
  );
};

export default AddToPlaylist;
