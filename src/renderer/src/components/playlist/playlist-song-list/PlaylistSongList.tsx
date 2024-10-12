import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import "./styles.css";
import { namespace } from "@renderer/App";
import IconButton from "@renderer/components/icon-button/IconButton";
import { Component, createSignal } from "solid-js";
import { PlaylistSongsQueryPayload, ResourceID } from "src/@types";

type PlaylistSongListProps = {
  playlistName: string;
};

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  const group = namespace.create(true);

  const [payload, _setPlayload] = createSignal<PlaylistSongsQueryPayload>({
    playlistName: props.playlistName,
  });

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue::create", {
      startSong: songResource,
      order: "",
      tags: [],
      view: { playlist: props.playlistName },
    });
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
          <IconButton>
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
          // setCount={setCount}
          // reset={resetListing}
          // onLoadItems={onSongsLoad}
          fallback={<div>No songs in playlist...</div>}
          builder={(s) => (
            <SongItem
              song={s}
              group={group}
              selectable={true}
              draggable={true}
              onSelect={createQueue}
              // onDrop={onDrop(s)}
            >
              {/* <SongContextMenuItem onClick={() => window.api.request("queue::removeSong", s.path)}>
              Remove from queue
            </SongContextMenuItem> */}
            </SongItem>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistSongList;
