import SongContextMenuItem from "@renderer/components/song/context-menu/SongContextMenuItem";
import { DeleteIcon } from "lucide-solid";
import { Component } from "solid-js";
import { deletePlaylist } from "../playlist-item/playlist-item.utils";
import Impulse from "@renderer/lib/Impulse";

type DeletePlaylistProps = {
  name: string;
  reset: Impulse;
};

const DeletePlaylist: Component<DeletePlaylistProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={() => {
        deletePlaylist(props.name, props.reset);
      }}
      class="hover:bg-red/20"
    >
      <p class="text-red">Delete playlist</p>
      <DeleteIcon class="text-red" size={20} />
    </SongContextMenuItem>
  );
};

export default DeletePlaylist;
