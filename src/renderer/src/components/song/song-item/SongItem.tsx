import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { ignoreClickInContextMenu } from "../context-menu/SongContextMenu";
import { song as selectedSong } from "../song.utils";
import Popover from "@renderer/components/popover/Popover";
import { EllipsisVerticalIcon } from "lucide-solid";
import { Component, createSignal, JSXElement, onMount, createMemo } from "solid-js";
import { Portal } from "solid-js/web";
import { twMerge } from "tailwind-merge";

type SongItemProps = {
  song: Song;
  group: string;
  selectable?: true;
  onSelect: (songResource: ResourceID) => any;
  draggable?: true;
  onDrop?: (before: Element | null) => any;
  contextMenu: JSXElement;
};

const SongItem: Component<SongItemProps> = (props) => {
  let item: HTMLDivElement | undefined;
  const [localShow, setLocalShow] = createSignal(false);
  const [mousePos, setMousePos] = createSignal<[number, number]>([0, 0]);

  onMount(() => {
    if (!item) {
      return;
    }

    draggable(item, {
      onClick: ignoreClickInContextMenu(() => props.onSelect(props.song.path)),
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
    <Popover
      isOpen={localShow}
      onValueChange={setLocalShow}
      placement="right"
      offset={{ crossAxis: 5, mainAxis: 5 }}
      shift={{}}
      flip={{}}
      mousePos={mousePos}
    >
      <Portal>
        <Popover.Overlay />
        <Popover.Content
          onClick={(e) => {
            e.stopImmediatePropagation();
            setLocalShow(false);
          }}
        >
          {props.contextMenu}
        </Popover.Content>
      </Portal>
      <div
        class="group relative isolate z-20 select-none rounded-md"
        classList={{
          "outline outline-2 outline-accent": isActive(),
        }}
        data-active={isActive()}
        ref={item}
        data-url={props.song.bg}
        onContextMenu={(e) => {
          setMousePos([e.clientX, e.clientY]);
          setLocalShow(true);
        }}
      >
        <SongImage
          class={twMerge(
            "absolute inset-0 z-[-1] h-full w-full rounded-md bg-cover bg-center bg-no-repeat opacity-30 group-hover:opacity-90",
            isActive() && "opacity-90",
          )}
          src={props.song.bg}
          group={props.group}
        />

        <div class="flex flex-row items-center justify-between rounded-md bg-black/50">
          <div class="z-20 flex min-h-[72px] flex-col justify-center overflow-hidden rounded-md p-3">
            <h3 class="text-shadow text-[22px] font-extrabold leading-7 shadow-black/60">
              {props.song.title}
            </h3>
            <p class="text-base text-subtext">{props.song.artist}</p>
          </div>

          <div class="mr-2 grid aspect-square size-9 place-items-center rounded border-solid border-stroke bg-transparent p-1 text-text hover:bg-surface">
            <Popover.Trigger
              class={twMerge(
                "opacity-0 transition-opacity group-hover:opacity-100",
                localShow() && "opacity-100",
              )}
            >
              <EllipsisVerticalIcon />
            </Popover.Trigger>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default SongItem;
