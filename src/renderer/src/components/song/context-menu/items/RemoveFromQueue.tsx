import SongContextMenuItem from "@renderer/components/song/context-menu/SongContextMenuItem";
import { DeleteIcon } from "lucide-solid";
import { Component } from "solid-js";
import { Song } from "@shared/types/common.types";

type RemoveFromQueueProps = {
  path: Song["path"] | undefined;
};

const RemoveFromQueue: Component<RemoveFromQueueProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={() => {
        if (props.path !== undefined && props.path !== "") {
          window.api.request("queue::removeSong", props.path);
        }
      }}
      class="hover:bg-red/20 hover:ring-1 ring-red/30"
    >
      <p class="text-red">Remove from queue</p>
      <DeleteIcon class="text-red" size={20} />
    </SongContextMenuItem>
  );
};

export default RemoveFromQueue;
