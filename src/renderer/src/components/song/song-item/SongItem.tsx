import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { ignoreClickInContextMenu } from "../context-menu/SongContextMenu";
import { song as selectedSong } from "../song.utils";
import { Component, createSignal, onMount } from "solid-js";

type SongItemProps = {
  song: Song;
  group: string;
  selectable?: true;
  onSelect: (songResource: ResourceID) => any;
  draggable?: true;
  onDrop?: (before: Element | null) => any;
  children?: any;
};

const SongItem: Component<SongItemProps> = ({
  group,
  onSelect,
  song,
  children,
  draggable: isDraggable,
  onDrop,
  selectable,
}) => {
  const showSignal = createSignal(false);
  const [_coords, setCoords] = createSignal<[number, number]>([0, 0], { equals: false });
  let item;

  const showMenu = (evt: MouseEvent) => {
    if (children === undefined) {
      showSignal[1](false);
      return;
    }

    setCoords([evt.clientX, evt.clientY]);
    showSignal[1](true);
  };

  onMount(() => {
    draggable(item, {
      onClick: ignoreClickInContextMenu(() => onSelect(song.path)),
      onDrop: onDrop ?? (() => {}),
      createHint: SongHint,
      useOnlyAsOnClickBinder: !isDraggable || selectedSong().path === song.path,
    });

    if (selectable === true) {
      (item as HTMLElement).dataset.path = song.path;
    }
  });

  return (
    <div
      class={`relative isolate select-none rounded-md ${
        selectedSong().path === song.path
          ? "data-[active=true]:after:bg-black/30 data-[active=true]:outline data-[active=true]:outline-2 data-[active=true]:outline-accent"
          : ""
      } hover:after:bg-overlay`}
      data-active={selectedSong().path === song.path}
      ref={item}
      data-url={song.bg}
      onContextMenu={showMenu}
    >
      <SongImage
        class="absolute inset-0 z-[-1] h-full w-full rounded-md bg-cover bg-center bg-no-repeat opacity-50 data-[active=true]:opacity-100"
        src={song.bg}
        group={group}
      />

      <div class="bg-black/50 flex min-h-[72px] flex-col justify-center overflow-hidden rounded-md p-3">
        <h3 class="text-shadow shadow-black/60 text-[22px] font-extrabold leading-7">
          {song.title}
        </h3>
        <p class="text-base text-subtext">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongItem;
