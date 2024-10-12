import "../../../assets/css/song/song-view.css";
import InfiniteScroller from "../../InfiniteScroller";
import IconButton from "../../icon-button/IconButton";
import PlaylistItem from "../playlist-item/PlaylistItem";
import {
  PLAYLIST_SCENE_CREATE,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import { namespace } from "@renderer/App";
import Impulse from "@renderer/lib/Impulse";
import { Component, createSignal } from "solid-js";

export type PlaylistListProps = {};

const PlaylistList: Component<PlaylistListProps> = () => {
  const [_count, setCount] = createSignal(0);
  const resetListing = new Impulse();
  // const [payload, setPayload] = createSignal({});
  const [playlistName, setPlaylistName] = createSignal("");

  const createPlaylist = () => {
    // last check is probably unnecessary
    if (playlistName().length === 0 || playlistName() === undefined || playlistName() === "") {
      return;
    }
    window.api.request("playlist::create", playlistName().trim());
    setPlaylistName("");
  };

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
      <div class="song-list-search">
        <div class="song-list-search__input-container">
          <input
            type="text"
            id="playlist_input"
            class="song-list-search__input"
            placeholder="Search in your playlists... (WIP)"
            // onInput={(e) => {
            //   setPlaylistName(e.target.value);
            // }}
          />
          <label class="song-list-search__icon-container" for="search_input">
            <IconButton
              onClick={() => {
                createPlaylist(); //TODO: remove
                setPlaylistActiveScene(PLAYLIST_SCENE_CREATE);
              }}
            >
              <i class="ri-add-fill" />
            </IconButton>
          </label>
        </div>
      </div>

      {/* <p>You have {count()} playlists</p> */}
      <InfiniteScroller
        apiKey={"query::playlists"}
        // apiData={payload()}
        apiInitKey={"query::playlists::init"}
        // apiInitData={payload()}
        setCount={setCount}
        reset={resetListing}
        fallback={<div>No playlists...</div>}
        builder={(s) => <PlaylistItem playlist={s} group={group}></PlaylistItem>}
      />
    </div>
  );
};

export default PlaylistList;
