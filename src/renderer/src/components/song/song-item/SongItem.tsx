import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { ignoreClickInContextMenu } from "../context-menu/SongContextMenu";
import { song as selectedSong } from "../song.utils";
import { Component, createMemo, onMount } from "solid-js";

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
  let item: HTMLDivElement | undefined;

  onMount(() => {
    if (!item) {
      return;
    }

    draggable(item, {
      onClick: () => ignoreClickInContextMenu(props.onSelect(props.song.path)),
      onDrop: props.onDrop ?? (() => {}),
      createHint: SongHint,
      useOnlyAsOnClickBinder: !props.draggable || selectedSong().path === props.song.path,
    });

    if (props.selectable === true) {
      item.dataset.path = props.song.path;
    }
  });

  const isActive = createMemo(() => {
    return selectedSong().path === props.song.path;
  });

  return (
    <div
      class="group relative isolate select-none rounded-md"
      classList={{
        "outline outline-2 outline-accent": isActive(),
      }}
      data-active={isActive()}
      ref={item}
      data-url={props.song.bg}
    >
      <SongImage
        class="absolute inset-0 z-[-1] h-full w-full rounded-md bg-cover bg-center bg-no-repeat opacity-30 group-hover:opacity-90"
        classList={{
          "opacity-90": isActive(),
        }}
        src={props.song.bg}
        group={props.group}
      />

      <div class="flex min-h-[72px] flex-col justify-center overflow-hidden rounded-md bg-black/50 p-3">
        <h3 class="text-shadow text-[22px] font-extrabold leading-7 shadow-black/60">
          {props.song.title}
        </h3>
        <p class="text-base text-subtext">{props.song.artist}</p>
      </div>
    </div>
  );
};

export default SongItem;
