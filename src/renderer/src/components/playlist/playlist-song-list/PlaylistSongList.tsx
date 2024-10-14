import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import { namespace } from "@renderer/App";
import IconButton from "@renderer/components/icon-button/IconButton";
import Impulse from "@renderer/lib/Impulse";
import { Component, createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import { PlaylistSongsQueryPayload, ResourceID, Song } from "src/@types";

type PlaylistSongListProps = {
  playlistName: string;
};

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  const group = namespace.create(true);

  const [payload, _setPlayload] = createSignal<PlaylistSongsQueryPayload>({
    playlistName: props.playlistName,
  });

  const [editMode, setEditMode] = createSignal(false);

  const reset = new Impulse();

  onMount(() => window.api.listen("playlist::resetSongList", reset.pulse.bind(reset)));
  onCleanup(() => window.api.removeListener("playlist::resetSongList", reset.pulse.bind(reset)));

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue::create", {
      startSong: songResource,
      order: "",
      tags: [],
      view: { playlist: props.playlistName },
    });
  };

  const deleteSong = async (playlistName: string, song: Song) => {
    await window.api.request("playlist::remove", playlistName, song);
  };

  return (
    <div class="mx-5 my-6">
      <div class="mb-6 flex w-full flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-5 text-xl font-medium">
          <IconButton
            onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}
            class="text-xl text-text"
          >
            <i class="ri-arrow-left-line"></i>
          </IconButton>
          <h3>{props.playlistName}</h3>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke text-text">
          <IconButton
            onClick={() => setEditMode(!editMode())}
            data-open={editMode()}
            class="rounded-lg text-xl"
            classList={{ "bg-accent text-thick-material": editMode() }}
          >
            <i class="ri-edit-line"></i>
          </IconButton>
        </div>
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
              ></SongItem>
              <Switch fallback={""}>
                <Match when={editMode() === true}>
                  <IconButton
                    onClick={() => deleteSong(props.playlistName, s)}
                    class="ml-3 mr-[-2px] rounded-lg border border-stroke text-rose-300"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </IconButton>
                </Match>
              </Switch>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistSongList;
