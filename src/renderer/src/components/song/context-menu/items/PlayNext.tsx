import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { Component, createSignal, Show } from "solid-js";

type SongPlayNextProps = {
  path: Song["path"];
};

const PlayNext: Component<SongPlayNextProps> = (props) => {
  const [show, setShow] = createSignal(false);

  window.api.listen("queue::created", () => {
    setShow(true);
  });

  window.api.listen("queue::destroyed", () => {
    setShow(false);
  });

  return (
    <Show when={show()}>
      <SongContextMenuItem onClick={() => window.api.request("queue::playNext", props.path)}>
        Play Next
      </SongContextMenuItem>
    </Show>
  );
};

export default PlayNext;
