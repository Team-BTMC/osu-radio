import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { deleteSong, PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist.utils";
import { namespace } from "@renderer/App";
import Button from "@renderer/components/button/Button";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import Impulse from "@renderer/lib/Impulse";
import { ArrowLeftIcon, DeleteIcon, PencilIcon, PencilOffIcon, Trash2Icon } from "lucide-solid";
import { Component, createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js";
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
    <div class="flex h-full flex-col">
      <div class="sticky top-0 z-10 mx-5 mb-4 mt-1 flex flex-row items-center">
        <div class="flex w-full flex-row items-center gap-5 font-medium">
          <Button
            variant={"ghost"}
            size={"square"}
            onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}
          >
            <ArrowLeftIcon class="text-subtext" size={20} />
          </Button>
          <h3 class="text-xl">{props.playlistName}</h3>
        </div>
        <Button
          variant={editMode() ? "secondary" : "outlined"}
          size={"square"}
          class="rounded-lg"
          onClick={() => {
            setEditMode(!editMode());
          }}
        >
          <Switch>
            <Match when={editMode() === true}>
              <PencilOffIcon size={20} />
            </Match>
            <Match when={editMode() === false}>
              <PencilIcon size={20} />
            </Match>
          </Switch>
        </Button>
      </div>
      <div class="h-full flex-grow overflow-y-auto p-5 py-0">
        <InfiniteScroller
          apiKey={"query::playlistSongs"}
          apiData={payload()}
          apiInitKey={"query::playlistSongs::init"}
          apiInitData={payload()}
          reset={reset}
          fallback={<div>No songs in playlist...</div>}
          builder={(s) => (
            <div class="flex items-stretch">
              <SongItem
                song={s}
                group={group}
                onSelect={createQueue}
                contextMenu={
                  <PlaylistSongListContextMenuContent song={s} playlistName={props.playlistName} />
                }
              />
              <div class="flex items-center justify-center">
                <Show when={editMode() === true}>
                  <Button
                    variant={"ghost"}
                    size={"square"}
                    class="ml-2 rounded-lg"
                    onClick={() => deleteSong(props.playlistName, s)}
                  >
                    <Trash2Icon class="text-danger opacity-80" />
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
