import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { ListStartIcon } from "lucide-solid";
import { Component } from "solid-js";

type SongPlayNextProps = {
  path: Song["path"] | undefined;
  disabled: boolean;
};

const PlayNext: Component<SongPlayNextProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={() => {
        if (props.path !== undefined && props.path !== "") {
          window.api.request("queue::playNext", props.path);
        }
      }}
      disabled={props.disabled}
    >
      <p>Play next</p>
      <ListStartIcon size={20} />
    </SongContextMenuItem>
  );
};

export default PlayNext;
