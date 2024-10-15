import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import { namespace } from "@renderer/App";
import Button from "@renderer/components/button/Button";
import IconButton from "@renderer/components/icon-button/IconButton";
import Impulse from "@renderer/lib/Impulse";
import { Component, createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import { PlaylistSongsQueryPayload, ResourceID, Song } from "src/@types";

type PlaylistSongListProps = {
  playlistName: string;
};

// let localPlaylistName: string;

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  const group = namespace.create(true);
  // const [playlistName, setPlaylistName] = createSignal("");

  const [payload, _setPayload] = createSignal<PlaylistSongsQueryPayload>({
    playlistName: props.playlistName,
  });

  const [editMode, setEditMode] = createSignal(false);

  const reset = new Impulse();

  onMount(() => {
    window.api.listen("playlist::resetSongList", reset.pulse.bind(reset));
    // localPlaylistName = props.playlistName;
    // setPayload({ playlistName: localPlaylistName });
  });
  onCleanup(() => window.api.removeListener("playlist::resetSongList", reset.pulse.bind(reset)));

  //todo move these to a .utils.ts file
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

  // const renamePlaylist = async (newName: string) => {
  //   newName = newName.trim();
  //   if (newName === undefined || newName === "" || newName === localPlaylistName) {
  //     return;
  //   }

  //   await window.api.request("playlist::rename", localPlaylistName, newName);
  //   localPlaylistName = newName;
  //   setPayload({ playlistName: localPlaylistName });
  //   reset.pulse();
  // };

  return (
    <div class="mx-5 my-6">
      <div class="mb-6 flex w-full flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-5 text-xl font-medium">
          <IconButton
            onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}
            class="text-xl text-text"
          >
            <i class="ri-arrow-left-line text-overlay"></i>
          </IconButton>
          {/* <Switch fallback={""}>
            <Match when={editMode() === true}>
              <input
                class="h-10 rounded-full border border-stroke bg-transparent pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
                type="text"
                id="playlist_name"
                value={localPlaylistName}
                onInput={(e) => {
                  setPlaylistName(e.target.value);
                }}
              />
            </Match>
            <Match when={editMode() === false}>
              <h3 class="text-xl">{localPlaylistName}</h3>
            </Match>
          </Switch> */}
          <h3 class="text-xl">{props.playlistName}</h3>
        </div>
        <Button
          variant={editMode() ? "accent" : "ghost"}
          size={"icon"}
          class="flex items-center justify-center border"
          onClick={() => {
            // await renamePlaylist(playlistName());
            setEditMode(!editMode());
          }}
        >
          <i class="ri-edit-line text-xl" />
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
              ></SongItem>
              <Switch fallback={""}>
                <Match when={editMode() === true}>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    // this needs to be slightly larger for some reason (probably margin)
                    class="ml-3 flex w-11 items-center justify-center border"
                    onClick={() => deleteSong(props.playlistName, s)}
                  >
                    <i class="ri-delete-bin-line text-lg text-rose-300" />
                  </Button>
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