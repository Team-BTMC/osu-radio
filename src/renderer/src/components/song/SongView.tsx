import Search from '../search/Search';
import SongItem from './SongItem';
import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { Optional, ResourceID, SongsQueryPayload, Tag } from '../../../../@types';
import "../../assets/css/song/song-view.css";
import { SearchQueryError } from '../../../../main/lib/search-parser/@search-types';
import { none, some } from '../../lib/rust-like-utils-client/Optional';
import InfiniteScroller from '../InfiniteScroller';
import ResetSignal from '../../lib/ResetSignal';
import { namespace } from '../../App';



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
  const listingReset = new ResetSignal();

  const searchSongs = async () => {
    const o = order();
    const t = tags();
    const parsedQuery = await window.api.request("parse.search", query());

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
    listingReset.reset();
  }

  onMount(() => {
    createEffect(searchSongs);
    window.api.listen("songView.reset", listingReset.reset.bind(listingReset));
  });

  onCleanup(() => {
    window.api.removeListener("songView.reset", listingReset.reset.bind(listingReset));
  });

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue.create", {
      startSong: songResource,
      ...payload()
    });
  }

  return (
    <div class="song-view" data-item-group={namespace.create(true)}>
      <Search
        query={querySignal}
        tags={tagsSignal}
        setOrder={setOrder}
        count={count}
        error={searchError}/>

      <InfiniteScroller
        apiKey={"query.songsPool"}
        initAPIKey={"query.songsPool.init"}
        apiData={payload()}
        setResultCount={setCount}
        reset={listingReset}
        builder={s =>
          <SongItem song={s} onSelect={createQueue}/>
        }
      />
    </div>
  );
}

export default SongView;