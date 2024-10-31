import SongContextMenuItem from "@renderer/components/song/context-menu/SongContextMenuItem";
import { ListXIcon } from "lucide-solid";
import { Component } from "solid-js";
import Impulse from "@renderer/lib/Impulse";
import { deletePlaylist } from "../playlist.utils";

type DeletePlaylistProps = {
  name: string;
  reset: Impulse;
};

const DeletePlaylist: Component<DeletePlaylistProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={async () => {
        await deletePlaylist(props.name, props.reset);
      }}
      class="hover:bg-red/20"
    >
      <p class="text-red">Delete playlist</p>
      <ListXIcon class="text-red" size={20} />
    </SongContextMenuItem>
  );
};

export default DeletePlaylist;
