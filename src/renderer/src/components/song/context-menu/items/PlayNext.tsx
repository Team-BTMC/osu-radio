import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { Component } from "solid-js";

type SongPlayNextProps = {
  path: Song["path"] | undefined;
};

const PlayNext: Component<SongPlayNextProps> = (props) => {
  return (
    <SongContextMenuItem
      onClick={() => {
        if (props.path !== undefined && props.path !== "") {
          window.api.request("queue::playNext", props.path);
        }
      }}
    >
      <p>Play next</p>
      <i class="ri-menu-add-line"></i>
    </SongContextMenuItem>
  );
};

export default PlayNext;
