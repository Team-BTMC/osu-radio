import { setMediaSession } from "@renderer/lib/Music";
import { averageBPM, msToBPM } from "@renderer/lib/song";
import { Component, createSignal, onMount } from "solid-js";
import { ResourceID, Song } from "../../../../@types";
import "../../assets/css/song/song-item.css";
import draggable from "../../lib/draggable/draggable";
import SongContextMenu, { ignoreClickInContextMenu } from "./context-menu/SongContextMenu";
import SongHint from "./SongHint";
import SongImage from "./SongImage";

type SongItemProps = {
  song: Song;
  group: string;
  selectable?: true;
  onSelect: (songResource: ResourceID) => any;
  draggable?: true;
  onDrop?: (before: Element | null) => any;
  children?: any;
};

const SongItem: Component<SongItemProps> = (props) => {
  const showSignal = createSignal(false);
  const [coords, setCoords] = createSignal<[number, number]>([0, 0], { equals: false });
  let item;

  const showMenu = (evt: MouseEvent) => {
    if (props.children === undefined) {
      showSignal[1](false);
      return;
    }

    setCoords([evt.clientX, evt.clientY]);
    showSignal[1](true);
  };

  onMount(() => {
    draggable(item, {
      onClick: ignoreClickInContextMenu(() => props.onSelect(props.song.path)),
      onDrop: props.onDrop ?? (() => {}),
      createHint: SongHint,
      useOnlyAsOnClickBinder: props.draggable !== true,
    });

    if (props.selectable === true) {
      (item as HTMLElement).dataset.path = props.song.path;
    }
  });

  const children: any[] = !(props.children instanceof Array) ? [props.children] : props.children;

  return (
    <div
      class="song-item"
      onContextMenu={showMenu}
      ref={item}
      data-url={props.song.bg}
      onClick={() => setMediaSession(props.song)}
    >
      <div class={"song-item-container"}>
        <SongImage src={props.song.bg} group={props.group} />

        <div class="column">
          <h3>
            [{msToBPM(averageBPM(props.song.bpm, props.song.duration * 1_000))} BPM]{" "}
            {props.song.title}
          </h3>
          <span>
            {props.song.artist} // {props.song.creator}
          </span>
        </div>
      </div>

      <SongContextMenu show={showSignal} container={item} coords={coords}>
        {...children}
      </SongContextMenu>
    </div>
  );
};

export default SongItem;
