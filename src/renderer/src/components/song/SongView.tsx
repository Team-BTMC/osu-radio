import Search from '../search/Search';
import Item from './Item';
import { Component, createEffect, createSignal, onMount } from 'solid-js';
import { Optional, SongsQueryPayload, Tag } from '../../../../@types';
import "../../assets/css/song-view.css";
import { SearchQueryError } from '../../../../main/lib/search-parser/@search-types';
import { none, some } from '../../lib/rust-like-utils-client/Optional';
import InfiniteScroller from '../InfiniteScroller';
import { TokenNamespace } from '../../lib/tungsten/token';
import ResetSignal from '../../lib/ResetSignal';



export type SongViewProps = {
  isAllSongs?: boolean,
  isQueue?: boolean,
  playlist?: string,
};

const namespace = new TokenNamespace();

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
    const parsedQuery = await window.api.request("parseSearch", query());

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
  });

  return (
    <div class="song-view" data-item-group={namespace.create(true)}>
      <Search
        query={querySignal}
        tags={tagsSignal}
        setOrder={setOrder}
        count={count}
        error={searchError}/>

      <InfiniteScroller
        apiKey={"querySongsPool"}
        initAPIKey={"querySongsPoolInit"}
        apiData={payload()}
        setResultCount={setCount}
        reset={listingReset}
        builder={s =>
          <Item song={s}/>
        }
      />
    </div>
  );
}

export default SongView;