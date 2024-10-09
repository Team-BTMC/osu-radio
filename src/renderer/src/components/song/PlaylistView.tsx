import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Optional, ResourceID, SongsQueryPayload, Tag } from "../../../../@types";
import { SearchQueryError } from "../../../../main/lib/search-parser/@search-types";
import { namespace } from "../../App";
import "../../assets/css/song/song-view.css";
import Impulse from "../../lib/Impulse";
import { none, some } from "../../lib/rust-like-utils-client/Optional";
import InfiniteScroller from "../InfiniteScroller";
import Search from "../search/Search";
import PlayNext from "./context-menu/items/PlayNext";
import SongItem from "./SongItem";

// export type SongViewProps = {
//   isAllSongs?: boolean;
//   isQueue?: boolean;
//   playlist?: string;
// };

export type PlaylistViewProps = {};

const PlaylistView: Component<PlaylistViewProps> = (props) => {
  const [count, setCount] = createSignal(0);
  const resetListing = new Impulse();
  const [payload, setPayload] = createSignal({});

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
      <InfiniteScroller
        apiKey={"query::playlists"}
        // apiData={payload()}
        apiInitKey={"query::playlists::init"}
        // apiInitData={payload()}
        setCount={setCount}
        reset={resetListing}
        fallback={<div>No playlists...</div>}
        builder={(s) => <div>{s}</div>}
      />
    </div>
  );
};

export default PlaylistView;
