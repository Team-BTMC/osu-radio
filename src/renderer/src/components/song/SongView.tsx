import Search from '../search/Search';
import SongItem from './SongItem';
import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { Optional, ResourceID, SongsQueryPayload, Tag } from '../../../../@types';
import "../../assets/css/song/song-view.css";
import { SearchQueryError } from '../../../../main/lib/search-parser/@search-types';
import { none, some } from '../../lib/rust-like-utils-client/Optional';
import InfiniteScroller from '../InfiniteScroller';
import { namespace } from '../../App';
import Impulse from '../../lib/Impulse';
import SongPlayNext from './SongPlayNext';



export type SongViewProps = {
  isAllSongs?: boolean,
  isQueue?: boolean,
  playlist?: string,
};

const SongView: Component<SongViewProps> = props => {
  const querySignal = createSignal("");
  const [query] = querySignal;

  const tagsSignal = createSignal<Tag[]>([], { equals:false });
  const [tags] = tagsSignal;

  const [order, setOrder] = createSignal("title:asc");
  const [count, setCount] = createSignal(0);

  const [payload, setPayload] = createSignal<SongsQueryPayload>({
    view: props,
    order: order(),
    tags: tags()
  });

  const [searchError, setSearchError] = createSignal<Optional<SearchQueryError>>(none(), { equals: false });
  const resetListing = new Impulse();

  const searchSongs = async () => {
    const o = order();
    const t = tags();
    const parsedQuery = await window.api.request("parse::search", query());

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
  }

  onMount(() => {
    createEffect(searchSongs);
    window.api.listen("songView::reset", resetListing.pulse.bind(resetListing));
  });

  onCleanup(() => {
    window.api.removeListener("songView::reset", resetListing.pulse.bind(resetListing));
  });

  const createQueue = async (songResource: ResourceID) => {
    console.log("create queue");

    await window.api.request("queue::create", {
      startSong: songResource,
      ...payload()
    });
  }

  const group = namespace.create(true);

  return (
    <div class="song-view">
      <Search
        query={querySignal}
        tags={tagsSignal}
        setOrder={setOrder}
        count={count}
        error={searchError}/>

      <InfiniteScroller
        apiKey={"query::songsPool"}
        apiData={payload()}
        apiInitKey={"query::songsPool::init"}
        apiInitData={payload()}
        setCount={setCount}
        reset={resetListing}
        fallback={<div>No songs...</div>}
        builder={s =>
          <SongItem
            song={s}
            group={group}
            onSelect={createQueue}
          >
            <SongPlayNext path={s.path}/>
            <div>Add to playlist</div>
          </SongItem>
        }
      />
    </div>
  );
}

export default SongView;