import SongImage from "../../song/SongImage";
import {
  deletePlaylist,
  PLAYLIST_SCENE_SONGS,
  setActivePlaylistName,
  setPlaylistActiveScene,
} from "../playlist.utils";
import { renamePlaylist } from "../playlist.utils";
import { getSongImage } from "./playlist-item.utils";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import Popover from "@renderer/components/popover/Popover";
import { ignoreClickInContextMenu } from "@renderer/components/song/context-menu/SongContextMenu";
import Impulse from "@renderer/lib/Impulse";
import draggable from "@renderer/lib/draggable/draggable";
import { EllipsisVerticalIcon, ListXIcon, PencilLineIcon } from "lucide-solid";
import { Component, createSignal, Match, onMount, Setter, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import { Playlist } from "src/@types";
import { twMerge } from "tailwind-merge";

export type PlaylistItemProps = {
  playlist: Playlist;
  group: string;
  reset: Impulse;
};

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
  let item: HTMLDivElement | undefined;

  const [playlistName, setPlaylistName] = createSignal("");
  const [editMode, setEditMode] = createSignal(false);
  const [localShow, setLocalShow] = createSignal(false);
  const [mousePos, setMousePos] = createSignal<[number, number]>([0, 0]);

  onMount(() => {
    if (!item) return;

    draggable(item, {
      onClick: ignoreClickInContextMenu(() => {
        if (!editMode()) {
          setActivePlaylistName(props.playlist.name);
          setPlaylistActiveScene(PLAYLIST_SCENE_SONGS);
        }
      }),
      onDrop: () => {},
      useOnlyAsOnClickBinder: true,
    });
  });

  return (
    <Popover
      isOpen={localShow}
      onValueChange={setLocalShow}
      placement="right"
      offset={{ crossAxis: 5, mainAxis: 5 }}
      shift={{}}
      flip={{}}
      position={mousePos}
    >
      <Portal>
        <Popover.Overlay />
        <Popover.Content
          onClick={(e) => {
            e.stopImmediatePropagation();
            setLocalShow(false);
          }}
        >
          {/* can't pass this as a prop like in song-item because i need the editMode signal */}
          <PlaylistItemContextMenuContent
            editMode={setEditMode}
            reset={props.reset}
            playlist={props.playlist}
          />
        </Popover.Content>
      </Portal>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setMousePos([e.clientX, e.clientY]);
          setLocalShow(true);
        }}
        class="group"
        ref={item}
      >
        <div class="flex flex-row gap-4">
          <div class="flex items-center justify-center rounded-lg">
            <SongImage
              src={getSongImage(props.playlist)}
              group={props.group}
              class="h-[71px] w-[71px] rounded-lg bg-cover bg-center"
            />
          </div>

          <div class="ml-[6px] flex w-full flex-row items-center justify-between">
            <div class="flex flex-col justify-center text-base font-medium text-text">
              <Switch fallback={""}>
                <Match when={editMode() === true}>
                  <input
                    class="focus:ring-accent h-10 rounded-full border border-stroke bg-transparent pl-4 pr-4 focus:outline-none focus:ring-2"
                    type="text"
                    id="playlist_name"
                    value={props.playlist.name}
                    onInput={(e) => {
                      setPlaylistName(e.target.value);
                    }}
                    onKeyPress={async (e) => {
                      if (e.key == "Enter") {
                        await renamePlaylist(props.playlist.name, playlistName());
                        setEditMode(false);
                        props.reset.pulse();
                      }
                    }}
                  />
                </Match>
                <Match when={editMode() === false}>
                  <h3 class="text-3xl font-bold">{props.playlist.name}</h3>
                </Match>
              </Switch>
              <p>{props.playlist.count} songs</p>
            </div>
            <Popover.Trigger
              class={twMerge(
                "inline-grid aspect-square size-9 place-items-center rounded opacity-0 transition-opacity hover:bg-surface group-hover:opacity-100",
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

type PlaylistItemContextMenuContentProps = {
  playlist: Playlist;
  reset: Impulse;
  editMode: Setter<boolean>;
};
const PlaylistItemContextMenuContent: Component<PlaylistItemContextMenuContentProps> = (props) => {
  return (
    <DropdownList class="w-40">
      <DropdownList.Item
        onClick={() => {
          props.editMode(true);
        }}
      >
        <span>Rename playlist</span>
        <PencilLineIcon class="text-subtext" size={20} />
      </DropdownList.Item>
      <DropdownList.Item
        onClick={() => {
          deletePlaylist(props.playlist.name, props.reset);
        }}
        class="text-danger"
      >
        <span>Delete playlist</span>
        <ListXIcon class="opacity-80" size={20} />
      </DropdownList.Item>
    </DropdownList>
  );
};

export default PlaylistItem;
