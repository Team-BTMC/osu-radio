import { PlaylistItemProps } from "./PlaylistItem";
import { deletePlaylist } from "./playlist-item.utils";
import { Component, Setter } from "solid-js";

type ContextMenuBoxProps = {
  playlistItem: PlaylistItemProps;
  editSignal: Setter<boolean>;
};

const ContextMenuBox: Component<ContextMenuBoxProps> = (props) => {
  return (
    <div class="w-36 rounded-lg bg-thick-material p-3">
      <div class="flex w-full flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.editSignal(true);
          }}
          class="rounded-lg py-1 pl-[10px] hover:cursor-pointer hover:bg-stroke"
        >
          Rename
        </button>
        <button
          class="rounded-lg py-1 pl-[10px] text-red hover:cursor-pointer hover:bg-red/20"
          onClick={(e) => deletePlaylist(e, props.playlistItem)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContextMenuBox;
