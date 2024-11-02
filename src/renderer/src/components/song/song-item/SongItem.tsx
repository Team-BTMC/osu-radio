import { ResourceID, Song } from "../../../../../@types";
import draggable from "../../../lib/draggable/draggable";
import SongHint from "../SongHint";
import SongImage from "../SongImage";
import { useColorExtractor } from "../color-extractor";
import { song as selectedSong } from "../song.utils";
import { transparentize } from "polished";
import Popover from "@renderer/components/popover/Popover";
import { EllipsisVerticalIcon } from "lucide-solid";
import { Component, createSignal, JSXElement, onMount, createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";

type SongItemProps = {
  song: Song;
  group: string;
  selectable?: true;
  onSelect: (songResource: ResourceID) => any;
  draggable?: true;
  onDrop?: (before: Element | null) => any;
  contextMenu?: JSXElement;
};

const SongItem: Component<SongItemProps> = (props) => {
  let item: HTMLDivElement | undefined;
  const { extractColorFromImage } = useColorExtractor();
  const { primaryColor, secondaryColor, processImage } = extractColorFromImage(props.song);
  const [localShow, setLocalShow] = createSignal(false);
  const [isHovering, setIsHovering] = createSignal(false);
  const [mousePos, setMousePos] = createSignal<[number, number] | undefined>();

  onMount(() => {
    if (!item) return;

    // Initialize draggable functionality
    draggable(item, {
      onClick: () => props.onSelect(props.song.path),
      onDrop: props.onDrop ?? (() => {}),
      createHint: SongHint,
      useOnlyAsOnClickBinder: !props.draggable || selectedSong().path === props.song.path,
    });

    if (props.selectable === true) {
      item.dataset.path = props.song.path;
    }
  });

  const isSelected = createMemo(() => {
    return selectedSong().audio === props.song.audio;
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

    if (isHovering() || localShow()) {
      return `linear-gradient(to right, ${color} 20%, ${transparentize(0.9)(color)}), rgba(255, 255, 255, 0.2)`;
    }

    return `linear-gradient(to right, ${color} 16%, ${transparentize(0.92)(color)})`;
  });

  return (
    <Popover
      isOpen={localShow}
      onValueChange={setLocalShow}
      placement="right"
      offset={{ crossAxis: 5, mainAxis: 5 }}
      position={mousePos}
      shift
      flip
    >
      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content
          onClick={(e) => {
            e.stopImmediatePropagation();
            setLocalShow(false);
          }}
        >
          {props.contextMenu}
        </Popover.Content>
      </Popover.Portal>

      <div
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        class="min-h-[72px] rounded-lg py-0.5 pl-1.5 pr-0.5 transition-colors active: group relative"
        classList={{
          "shadow-glow-blue": isSelected(),
          "pr-6": isHovering() || localShow(),
        }}
        style={{
          background: borderColor(),
          "transition-property": "padding, background",
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setMousePos([e.clientX, e.clientY]);
          setLocalShow(true);
        }}
      >
        <div
          class="relative isolate select-none rounded-lg"
          classList={{}}
          ref={item}
          data-url={props.song.bg}
        >
          <SongImage
            class={`absolute inset-0 z-[-1] h-full w-full rounded-l-[9px] rounded-r-md bg-cover bg-center bg-no-repeat bg-scroll`}
            src={props.song.bg}
            group={props.group}
            onImageLoaded={processImage}
          />
          <div
            class="flex flex-col justify-center overflow-hidden rounded-md p-3 transition-transform pr-10 group-hover:pr-6"
            style={{
              background: backgrund(),
              "transition-property": "padding, background",
            }}
          >
            <h3 class="drop-shadow-md text-[22px] font-[740] leading-7">{props.song.title}</h3>
            <p class="text-base text-subtext drop-shadow-sm">{props.song.artist}</p>
          </div>
        </div>

        <Popover.Anchor
          onClick={(e) => {
            e.stopPropagation();
            setMousePos(undefined);
            setLocalShow(true);
          }}
          class="absolute right-0 top-0 h-full  flex items-center text-subtext transition-colors hover:text-text"
          title="Song options"
          classList={{
            "text-text": localShow(),
          }}
        >
          <div
            class={twMerge("opacity-0 transition-opacity z-10")}
            classList={{
              "opacity-100": isHovering() || localShow(),
            }}
            style={{
              color: isSelected() ? secondaryColor() : undefined,
            }}
          >
            <EllipsisVerticalIcon />
          </div>
        </Popover.Anchor>
      </div>
    </Popover>
  );
};

export default SongItem;
