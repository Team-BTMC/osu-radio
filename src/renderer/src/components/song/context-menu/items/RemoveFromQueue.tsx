import SongContextMenuItem from "../SongContextMenuItem";
import { DeleteIcon } from "lucide-solid";
import { Component } from "solid-js";
import { Song } from "src/@types";

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
    >
      <p>Remove from queue</p>
      <DeleteIcon />
    </SongContextMenuItem>
  );
};

export default RemoveFromQueue;
