import SongContextMenuItem from "@renderer/components/song/context-menu/SongContextMenuItem";
import { PencilLineIcon } from "lucide-solid";
import { Component, Setter } from "solid-js";

type RenamePlaylistProps = {
  setEdit: Setter<boolean>;
};

const RenamePlaylist: Component<RenamePlaylistProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={() => {
        props.setEdit(true);
      }}
      class="hover:bg-red/20"
    >
      <p>Rename playlist</p>
      <PencilLineIcon size={20} />
    </SongContextMenuItem>
  );
};

export default RenamePlaylist;
