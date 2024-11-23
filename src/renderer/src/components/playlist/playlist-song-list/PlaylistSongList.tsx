import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { deleteSong, PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist.utils";
import { namespace } from "@renderer/App";
import Button from "@renderer/components/button/Button";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import Impulse from "@renderer/lib/Impulse";
import { ArrowLeftIcon, DeleteIcon, PencilIcon, Trash2Icon } from "lucide-solid";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { PlaylistSongsQueryPayload, ResourceID, Song } from "src/@types";

type PlaylistSongListProps = {
  playlistName: string;
};

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  const group = namespace.create(true);

  const [payload] = createSignal<PlaylistSongsQueryPayload>({
    playlistName: props.playlistName,
  });

  const [editMode, setEditMode] = createSignal(false);
  const [, setIsQueueExist] = createSignal(false);

  const reset = new Impulse();

  onMount(async () => {
    window.api.listen("playlist::resetSongList", reset.pulse.bind(reset));
    setIsQueueExist(await window.api.request("queue::exists"));
  });

  onCleanup(() => window.api.removeListener("playlist::resetSongList", reset.pulse.bind(reset)));

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue::create", {
      startSong: songResource,
      order: { direction: "asc", option: "none" },
      tags: [],
      view: { playlist: props.playlistName },
    });
    setIsQueueExist(true);
  };

  return (
    <div class="mx-5 my-6">
      <div class="mb-6 flex w-full flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-5 text-xl font-medium">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}
          >
            <ArrowLeftIcon class="text-overlay" />
          </Button>
          <h3 class="text-xl">{props.playlistName}</h3>
        </div>
        <Button
          variant={editMode() ? "primary" : "ghost"}
          size={"icon"}
          class="rounded-lg"
          onClick={() => {
            setEditMode(!editMode());
          }}
        >
          <PencilIcon class="size-5" />
        </Button>
      </div>
      <div class="flex-grow">
        <InfiniteScroller
          apiKey={"query::playlistSongs"}
          apiData={payload()}
          apiInitKey={"query::playlistSongs::init"}
          apiInitData={payload()}
          reset={reset}
          fallback={<div>No songs in playlist...</div>}
          builder={(s) => (
            <div class="flex flex-row">
              <SongItem
                song={s}
                group={group}
                selectable={true}
                draggable={true}
                onSelect={createQueue}
                contextMenu={
                  <PlaylistSongListContextMenuContent song={s} playlistName={props.playlistName} />
                }
              />
              <div class="flex items-center justify-center">
                <Show when={editMode() === true}>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    class="ml-2 rounded-lg"
                    onClick={() => deleteSong(props.playlistName, s)}
                  >
                    <Trash2Icon class="text-danger" />
                  </Button>
                </Show>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

type PlaylistSongListContextMenuContentProps = { song: Song; playlistName: string };
const PlaylistSongListContextMenuContent: Component<PlaylistSongListContextMenuContentProps> = (
  props,
) => {
  return (
    <DropdownList class="w-52">
      <DropdownList.Item
        onClick={() => {
          deleteSong(props.playlistName, props.song);
        }}
        class="text-danger"
      >
        <span>Remove from Playlist</span>
        <DeleteIcon class="opacity-80" size={20} />
      </DropdownList.Item>
    </DropdownList>
  );
};

export default PlaylistSongList;
