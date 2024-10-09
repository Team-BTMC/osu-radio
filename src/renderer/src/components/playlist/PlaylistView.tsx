import { Component, createSignal } from "solid-js";
import "../../assets/css/song/song-view.css";
import InfiniteScroller from "../InfiniteScroller";
import PlaylistItem from "./PlaylistItem";
import { namespace } from "@renderer/App";

export type PlaylistViewProps = {};

const PlaylistView: Component<PlaylistViewProps> = (props) => {
  const [count, setCount] = createSignal(0);
  // const resetListing = new Impulse();
  // const [payload, setPayload] = createSignal({});

  const group = namespace.create(true);

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
      You have {count()} playlists
      <InfiniteScroller
        apiKey={"query::playlists"}
        // apiData={payload()}
        apiInitKey={"query::playlists::init"}
        // apiInitData={payload()}
        setCount={setCount}
        // reset={resetListing}
        fallback={<div>No playlists...</div>}
        builder={(s) => <PlaylistItem playlistName={s} group={group}></PlaylistItem>}
      />
    </div>
  );
};

export default PlaylistView;
