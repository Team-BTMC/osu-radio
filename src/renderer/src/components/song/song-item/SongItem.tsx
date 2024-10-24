import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { ignoreClickInContextMenu } from "../context-menu/SongContextMenu";
import { song as selectedSong } from "../song.utils";
import { Component, createSignal, onMount } from "solid-js";
import { useColorExtractor } from "../colorExtractor"; // Import the color hook

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
  const { songColor, borderColor } = extractColorFromImage(song);

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

  return (
    <div
      class={`relative isolate select-none rounded-md group ${selectedSong().path === song.path ? "outline outline-2" : ""}`}
      data-active={selectedSong().path === song.path}
      ref={item}
      data-url={song.bg}
      onContextMenu={(evt) => setCoords([evt.clientX, evt.clientY])}
      style={{
        border: `2px solid ${borderColor()}`, // Default border color
        "border-left": selectedSong().path === song.path ? "5px solid white" : `5px solid ${borderColor()}`, // Thicker left border for 3D effect and white when selected
        background: `linear-gradient(to right, ${songColor()}, rgba(255, 255, 255, 1))`, // Gradient background from songColor to white
        "box-shadow": selectedSong().path === song.path ? `0 0 15px 3px ${songColor()}` : "none", // Glow effect only on selected song
      }}
    >
      <SongImage
        class={`absolute inset-0 z-[-1] h-full w-full rounded-md bg-cover bg-center bg-no-repeat opacity-50 transition-opacity group-hover:opacity-90 ${selectedSong().path === song.path ? "opacity-90" : ""}`}
        src={song.bg}
        group={group}
      />
      <div class="flex min-h-[72px] flex-col justify-center overflow-hidden rounded-md bg-black/50 p-3">
        <h3 class="text-shadow text-[22px] font-extrabold leading-7 shadow-black/60">
          {song.title}
        </h3>
        <p class="text-base text-subtext">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongItem;
