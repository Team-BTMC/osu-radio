import Search from '../Search';
import Item from './Item';
import { Component, createSignal, For, onMount, Show } from 'solid-js';
import { Song } from '../../../../@types';



export type SongViewProps = {
  isAllSongs?: boolean,
  isQueue?: boolean
  playlist?: string
}

const SongView: Component<SongViewProps> = props => {
  const [songs, setSongs] = createSignal<Song[]>([]);
  const query = createSignal("");

  onMount(async () => {
    const opt = await window.api.request("querySongsPool", {
      view: props,
      searchQuery: query[0]()
    });

    if (opt.isNone) {
      setSongs([]);
      return;
    }

    setSongs(opt.value);
  });

  return (
    <>
      <Search query={query}/>

      <Show when={songs().length !== 0} fallback={<div>No songs...</div>}>
        <div class={"list"}>
          <For each={songs()}>{song =>
            <Item song={song}/>
          }</For>
        </div>
      </Show>
    </>
  );
}

export default SongView;