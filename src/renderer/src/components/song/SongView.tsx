import Search from '../Search';
import Item from './Item';
import { Component, createEffect, createSignal, For, onMount, Show } from 'solid-js';
import { Optional, Song } from '../../../../@types';
import "../../assets/css/song-view.css";
import { SearchQueryError } from '../../../../main/lib/search-parser/@search-types';
import { none, some } from '../../lib/rust-like-utils-client/Optional';



export type SongViewProps = {
  isAllSongs?: boolean,
  isQueue?: boolean
  playlist?: string
};

const SongView: Component<SongViewProps> = props => {
  const [songs, setSongs] = createSignal<Song[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const query = createSignal("");
  const [searchError, setSearchError] = createSignal<Optional<SearchQueryError>>(none());

  const searchSongs = async () => {
    const q = query[0]();
    console.log(`'${q}'`);

    const parsedQuery = await window.api.request("parseSearch", q);
    console.log(parsedQuery);

    if (parsedQuery.type === "error") {
      setSearchError(some(parsedQuery));
      return;
    }

    setSearchError(none());

    // const opt = await window.api.request("querySongsPool", {
    //   view: props,
    //   searchQuery: parsedQuery
    // });
    //
    // if (opt.isNone) {
    //   setSongs([]);
    //   return;
    // }
    //
    // setSongs(opt.value);
    // setIsLoading(false);
  }

  onMount(() => {
    createEffect(searchSongs);
  });

  return (
    <div class="song-view">
      <Search query={query} error={searchError}/>

      <Show when={isLoading() === false} fallback={<div>Loading songs...</div>}>
        <Show when={songs().length !== 0} fallback={<div>No songs...</div>}>
          <div class={"list"}>
            <For each={songs()}>{song =>
              <Item song={song}/>
            }</For>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default SongView;