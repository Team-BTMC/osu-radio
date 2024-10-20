import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { ignoreClickInContextMenu } from "../context-menu/SongContextMenu";
import { song as selectedSong } from "../song.utils";
import Popover from "@renderer/components/popover/Popover";
import { EllipsisVerticalIcon } from "lucide-solid";
import { Component, createSignal, JSXElement, onMount } from "solid-js";
import { Portal } from "solid-js/web";

type SongItemProps = {
  song: Song;
  group: string;
  selectable?: true;
  onSelect: (songResource: ResourceID) => any;
  draggable?: true;
  onDrop?: (before: Element | null) => any;
  contextMenu: JSXElement;
};

const SongItem: Component<SongItemProps> = ({
  group,
  onSelect,
  song,
  draggable: isDraggable,
  onDrop,
  selectable,
  contextMenu,
}) => {
  let item: HTMLDivElement | undefined;
  const [localShow, setLocalShow] = createSignal(false);

  onMount(() => {
    if (!item) {
      return;
    }

    draggable(item, {
      onClick: ignoreClickInContextMenu(() => onSelect(song.path)),
      onDrop: onDrop ?? (() => {}),
      createHint: SongHint,
      useOnlyAsOnClickBinder: !isDraggable || selectedSong().path === song.path,
    });

    if (selectable === true) {
      item.dataset.path = song.path;
    }
  });

  return (
    <Popover
      isOpen={localShow}
      onValueChange={setLocalShow}
      placement="right"
      offset={{ crossAxis: 20 }}
      shift={{ crossAxis: false }}
      flip={{}}
    >
      <Portal>
        <Popover.Overlay />
        <Popover.Content
          onClick={(e) => {
            e.stopImmediatePropagation();
            setLocalShow(false);
          }}
        >
          {contextMenu}
        </Popover.Content>
      </Portal>
      <div
        class="group relative isolate z-20 select-none rounded-md"
        classList={{
          "outline outline-2 outline-accent": selectedSong().path === song.path,
        }}
        data-active={selectedSong().path === song.path}
        ref={item}
        data-url={song.bg}
        onContextMenu={() => setLocalShow(true)}
      >
        <SongImage
          class="absolute inset-0 z-[-1] h-full w-full rounded-md bg-cover bg-center bg-no-repeat opacity-30 group-hover:opacity-90"
          classList={{
            "opacity-90": selectedSong().path === song.path,
          }}
          src={song.bg}
          group={group}
        />

        <div class="flex flex-row items-center justify-between rounded-md bg-black/50">
          <div class="z-20 flex min-h-[72px] flex-col justify-center overflow-hidden rounded-md p-3">
            <h3 class="text-shadow text-[22px] font-extrabold leading-7 shadow-black/60">
              {song.title}
            </h3>
            <p class="text-base text-subtext">{song.artist}</p>
          </div>

          <div class="mr-2 grid aspect-square size-9 place-items-center rounded border-solid border-stroke bg-transparent p-1 text-text hover:bg-surface">
            <Popover.Trigger class="opacity-0 transition-opacity group-hover:opacity-100">
              <EllipsisVerticalIcon />
            </Popover.Trigger>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default SongItem;
