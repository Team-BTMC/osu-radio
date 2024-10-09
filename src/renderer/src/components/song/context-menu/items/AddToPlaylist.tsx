import { Component, createSignal, Show } from "solid-js";
import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";

type SongAddToPlaylistNextProps = {
  song: Song;
};

const AddToPlaylist: Component<SongAddToPlaylistNextProps> = (props) => {
  const [show, setShow] = createSignal(false);

  window.api.listen("queue::created", () => {
    setShow(true);
  });

  window.api.listen("queue::destroyed", () => {
    setShow(false);
  });

  return (
    <Show when={show()}>
      <SongContextMenuItem onClick={() => console.log("click", props.song)}>
        Add to Playlist
      </SongContextMenuItem>
    </Show>
  );
};

export default AddToPlaylist;
