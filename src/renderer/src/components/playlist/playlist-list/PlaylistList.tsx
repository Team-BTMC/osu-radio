import "../../../assets/css/song/song-view.css";
import InfiniteScroller from "../../InfiniteScroller";
import IconButton from "../../icon-button/IconButton";
import PlaylistItem from "../playlist-item/PlaylistItem";
import {
  PLAYLIST_SCENE_CREATE,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import "./styles.css";
import { namespace } from "@renderer/App";
import Impulse from "@renderer/lib/Impulse";
import { Component, createSignal } from "solid-js";

export type PlaylistListProps = {};

const PlaylistList: Component<PlaylistListProps> = () => {
  // const [playlistSearch, setPlaylistSearch] = createSignal("");
  const [_count, setCount] = createSignal(0);
  const resetListing = new Impulse();

  const group = namespace.create(true);

  return (
    <div class="playlist-list">
      {/* <Search
        query={querySignal}
        tags={tagsSignal}
        setOrder={setOrder}
        count={count}
        error={searchError}
      />
      */}
      <div class="playlist-list__header">
        <div class="playlist-list__header__input-container">
          <input
            type="text"
            id="playlist_input"
            class="playlist-list__header__input"
            placeholder="Search in your playlists... (WIP)"
            // onInput={(e) => {
            //   setPlaylistSearch(e.target.value);
            // }}
          />
          <i class="ri-search-line playlist-list__header__search-icon"></i>
        </div>
        <IconButton
          onClick={() => {
            setPlaylistActiveScene(PLAYLIST_SCENE_CREATE);
          }}
        >
          <i class="ri-add-fill" />
        </IconButton>
      </div>

      <div class="playlist-list__body">
        <InfiniteScroller
          apiKey={"query::playlists"}
          apiInitKey={"query::playlists::init"}
          setCount={setCount}
          reset={resetListing}
          fallback={<div>No playlists...</div>}
          builder={(s) => (
            <PlaylistItem playlist={s} group={group} reset={resetListing}></PlaylistItem>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistList;
