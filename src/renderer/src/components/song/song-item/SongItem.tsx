import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { useColorExtractor } from "../colorExtractor";
import { ignoreClickInContextMenu } from "../context-menu/SongContextMenu";
import { song as selectedSong } from "../song.utils";
import { transparentize } from "polished";
import { Component, createMemo, createSignal, onMount } from "solid-js";

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
  draggable: isDraggable,
  onDrop,
  selectable,
}) => {
  let item: HTMLDivElement | undefined;
  const [, setCoords] = createSignal<[number, number]>([0, 0], { equals: false });

  const { extractColorFromImage } = useColorExtractor();
  const { primaryColor, secondaryColor } = extractColorFromImage(song);

  onMount(() => {
    if (!item) return;

    // Initialize draggable functionality
    draggable(item, {
      onClick: ignoreClickInContextMenu(() => {
        onSelect(song.path);
      }),
      onDrop: onDrop ?? (() => {}),
      createHint: SongHint,
      useOnlyAsOnClickBinder: !isDraggable || selectedSong().path === song.path,
    });

    if (selectable === true) {
      item.dataset.path = song.path;
    }
  });

  const isSelected = createMemo(() => {
    return selectedSong().audio === song.audio;
  });

  const borderColor = createMemo(() => {
    const color = secondaryColor();
    if (isSelected()) {
      return "#ffffff";
    }

    if (typeof color === "undefined") {
      return "rgba(var(--color-thick-material))";
    }

    return color;
  });

  const backgrund = createMemo(() => {
    const color = primaryColor();
    if (!color) {
      return "rgba(0, 0, 0, 0.72)";
    }

    const lowerAlpha = transparentize(0.9);
    return `linear-gradient(to right, ${color}, ${lowerAlpha(color)})`;
  });

  return (
    <div
      class="min-h-[72px] rounded-lg py-0.5 pl-1.5 pr-0.5 transition-colors"
      classList={{
        "shadow-glow-blue": isSelected(),
      }}
      style={{
        background: borderColor(),
      }}
    >
      <div
        class="group relative isolate select-none rounded-lg"
        ref={item}
        data-url={song.bg}
        onContextMenu={(evt) => setCoords([evt.clientX, evt.clientY])}
      >
        <SongImage
          class={`absolute inset-0 z-[-1] h-full w-full rounded-md bg-cover bg-center bg-no-repeat`}
          src={song.bg}
          group={group}
        />
        <div
          class="flex flex-col justify-center overflow-hidden rounded-md p-3"
          style={{
            background: backgrund(),
          }}
        >
          <h3 class="text-shadow text-[22px] font-extrabold leading-7">{song.title}</h3>
          <p class="text-base text-subtext">{song.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
