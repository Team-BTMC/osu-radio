import Search from '../Search';
import Item from './Item';
import { Component, createEffect, createSignal, onMount } from 'solid-js';
import { Optional, SongsQueryPayload } from '../../../../@types';
import "../../assets/css/song-view.css";
import { SearchQueryError } from '../../../../main/lib/search-parser/@search-types';
import { none, some } from '../../lib/rust-like-utils-client/Optional';
import InfiniteScroller from '../InfiniteScroller';
import { TokenNamespace } from '../../lib/tungsten/token';



export type SongViewProps = {
  isAllSongs?: boolean,
  isQueue?: boolean
  playlist?: string
};

const namespace = new TokenNamespace();

const SongView: Component<SongViewProps> = props => {
  const querySignal = createSignal("");
  const [query] = querySignal;
  const [payload, setPayload] = createSignal<SongsQueryPayload>({ view: props });

  const [searchError, setSearchError] = createSignal<Optional<SearchQueryError>>(none());

  const searchSongs = async () => {
    const parsedQuery = await window.api.request("parseSearch", query());
    console.log(parsedQuery);

    if (parsedQuery.type === "error") {
      setSearchError(some(parsedQuery));
      return;
    }

    setSearchError(none());
    setPayload({
      view: props,
      searchQuery: parsedQuery
    });
  }

  onMount(() => {
    createEffect(searchSongs);
  });

  return (
    <div class="song-view" data-item-group={namespace.create(true)}>
      <Search query={querySignal} error={searchError}/>

      <InfiniteScroller apiKey={"querySongsPool"} apiData={payload()} builder={s =>
        <Item song={s}/>
      }/>
    </div>
  );
}

export default SongView;