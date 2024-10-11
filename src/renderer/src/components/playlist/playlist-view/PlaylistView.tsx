import { Component, createSignal, onCleanup, onMount } from "solid-js";
import "../../../assets/css/song/song-view.css";
import InfiniteScroller from "../../InfiniteScroller";
import PlaylistItem from "../playlist-item/PlaylistItem";
import { namespace } from "@renderer/App";
import Impulse from "@renderer/lib/Impulse";
import IconButton from "../../icon-button/IconButton";

export type PlaylistViewProps = {};


const PlaylistView: Component<PlaylistViewProps> = (props) => {
  const [count, setCount] = createSignal(0);
  const resetListing = new Impulse();
  // const [payload, setPayload] = createSignal({});
  const [playlistName, setPlaylistName] = createSignal("");

  const createPlaylist = () => {
    window.api.request("playlist::create", playlistName());
    setPlaylistName("");
  }

  const group = namespace.create(true);

  //todo: make something like App.tsx or MainScene.tsx to load a playlist (scene signal) or something with Routers
  return (
    <div class="playlist-view">
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
          <input type="text" id="playlist_input" class="song-list-search__input" onInput={(e)=>{setPlaylistName(e.target.value)}} />
          <label class="song-list-search__icon-container" for="search_input">
            <IconButton onClick={()=>{createPlaylist()}}>
              <i class="ri-add-fill" />
            </IconButton>
          </label>
        </div>
      </div>
      
      <p>You have {count()} playlists</p>
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

export default PlaylistView;
