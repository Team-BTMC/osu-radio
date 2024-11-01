import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { namespace } from "@renderer/App";
import Button from "@renderer/components/button/Button";
import Impulse from "@renderer/lib/Impulse";
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-solid";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { PlaylistSongsQueryPayload, ResourceID } from "src/@types";
import SongContextMenu from "@renderer/components/song/context-menu/SongContextMenu";
import PlayNext from "@renderer/components/song/context-menu/items/PlayNext";
import RemoveFromPlaylist from "../context-menu-items/RemoveFromPlaylist";
import { deleteSong, PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist.utils";

type PlaylistSongListProps = {
  playlistName: string;
};

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  const group = namespace.create(true);

  const [payload] = createSignal<PlaylistSongsQueryPayload>({
    playlistName: props.playlistName,
  });

  const [editMode, setEditMode] = createSignal(false);
  const [isQueueExist, setIsQueueExist] = createSignal(false);

  const reset = new Impulse();

  onMount(() => {
    window.api.listen("playlist::resetSongList", reset.pulse.bind(reset));
  });
  onCleanup(() => window.api.removeListener("playlist::resetSongList", reset.pulse.bind(reset)));

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue::create", {
      startSong: songResource,
      order: { direction: "asc", option: "none" },
      tags: [],
      view: { playlist: props.playlistName },
    });
    // todo: check if a queue already exists
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
      <div>
        <InfiniteScroller
          apiKey={"query::playlistSongs"}
          apiData={payload()}
          apiInitKey={"query::playlistSongs::init"}
          apiInitData={payload()}
          reset={reset}
          class="flex flex-col gap-4"
          fallback={<div>No songs in playlist...</div>}
          builder={(s) => (
            <div class="flex w-full flex-row items-center justify-center">
              <SongItem
                song={s}
                group={group}
                selectable={true}
                draggable={true}
                onSelect={createQueue}
                contextMenu={
                  <SongContextMenu>
                    <PlayNext path={s.path} disabled={!isQueueExist()} />
                    <RemoveFromPlaylist playlistName={props.playlistName} song={s} />
                  </SongContextMenu>
                }
              />
              <Show when={editMode() === true}>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  // this needs to be slightly larger for some reason (probably margin)
                  class="ml-3 w-10 rounded-lg"
                  onClick={() => deleteSong(props.playlistName, s)}
                >
                  <Trash2Icon class="text-red" />
                </Button>
              </Show>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistSongList;
