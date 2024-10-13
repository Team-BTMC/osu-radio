import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import "./styles.css";
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
    <div class="playlist-song-list">
      <div class="playlist-song-list__top">
        <div class="playlist-song-list__top__left">
          <IconButton onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}>
            <i class="ri-arrow-left-line"></i>
          </IconButton>
          <h3>{props.playlistName}</h3>
        </div>
        <div class="playlist-song-list__top__right">
          <IconButton onClick={() => setEditMode(!editMode())} data-open={editMode()}>
            <i class="ri-edit-line"></i>
          </IconButton>
        </div>
      </div>
      <div class="playlist-song-list__list">
        <InfiniteScroller
          apiKey={"query::playlistSongs"}
          apiData={payload()}
          apiInitKey={"query::playlistSongs::init"}
          apiInitData={payload()}
          reset={reset}
          fallback={<div>No songs in playlist...</div>}
          builder={(s) => (
            <div class="playlist-song-list__list__item">
              <SongItem
                song={s}
                group={group}
                selectable={true}
                draggable={true}
                onSelect={createQueue}
              ></SongItem>
              <Switch fallback={""}>
                <Match when={editMode() === true}>
                  <IconButton onClick={() => deleteSong(props.playlistName, s)}>
                    <i class="ri-delete-bin-line playlist-song-list__list__item__delete-button"></i>
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
