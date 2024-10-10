import SongListSearch from "../song-list-search/SongListSearch";
import SongItem from "../song-item/SongItem";
import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Optional, ResourceID, SongsQueryPayload, Tag } from "../../../../../@types";
import { SearchQueryError } from "../../../../../main/lib/search-parser/@search-types";
import { none, some } from "../../../lib/rust-like-utils-client/Optional";
import InfiniteScroller from "../../InfiniteScroller";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import PlayNext from "../context-menu/items/PlayNext";
import { songsSearch } from "./song-list.utils";
import "./styles.css";

export type SongViewProps = {
  isAllSongs?: boolean;
  isQueue?: boolean;
  playlist?: string;
};

const SongList: Component<SongViewProps> = (props) => {
  const tagsSignal = createSignal<Tag[]>([], { equals: false });
  const [tags] = tagsSignal;

  const [order, setOrder] = createSignal("title:asc");
  const [count, setCount] = createSignal(0);

  const [payload, setPayload] = createSignal<SongsQueryPayload>({
    view: props,
    order: order(),
    tags: tags()
  });

  const [searchError, setSearchError] = createSignal<Optional<SearchQueryError>>(none(), {
    equals: false
  });
  const resetListing = new Impulse();

  const searchSongs = async () => {
    const o = order();
    const t = tags();
    const parsedQuery = await window.api.request("parse::search", songsSearch());

    if (parsedQuery.type === "error") {
      setSearchError(some(parsedQuery));
      return;
    }

    setSearchError(none());
    setPayload({
      view: props,
      searchQuery: parsedQuery,
      order: o,
      tags: t
    });
    resetListing.pulse();
  };

  onMount(() => {
    createEffect(searchSongs);
    window.api.listen("songView::reset", resetListing.pulse.bind(resetListing));
  });

  onCleanup(() => {
    window.api.removeListener("songView::reset", resetListing.pulse.bind(resetListing));
  });

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue::create", {
      startSong: songResource,
      ...payload()
    });
  };

  const group = namespace.create(true);

  return (
    <div class="song-list">
      <div class="song-list__search-container">
        <SongListSearch tags={tagsSignal} setOrder={setOrder} count={count} error={searchError} />
      </div>

      <div class="song-list__songs">
        <InfiniteScroller
          apiKey={"query::songsPool"}
          apiData={payload()}
          apiInitKey={"query::songsPool::init"}
          apiInitData={payload()}
          setCount={setCount}
          reset={resetListing}
          fallback={<div>No songs...</div>}
          builder={(s) => (
            <SongItem song={s} group={group} onSelect={createQueue}>
              <PlayNext path={s.path} />
              <button>Add to playlist</button>
            </SongItem>
          )}
        />
      </div>
    </div>
  );
};

export default SongList;
