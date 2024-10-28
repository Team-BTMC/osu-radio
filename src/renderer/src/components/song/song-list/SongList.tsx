import { Optional, Order, ResourceID, SongsQueryPayload, Tag } from "@shared/types/common.types";
import { namespace } from "@renderer/App";
import Impulse from "@renderer/lib/Impulse";
import { none, some } from "@shared/lib/rust-types/Optional";
import InfiniteScroller from "@renderer/components/InfiniteScroller";
import SongContextMenu from "@renderer/components/song/context-menu/SongContextMenu";
import AddToPlaylist from "@renderer/components/song/context-menu/items/AddToPlaylist";
import PlayNext from "@renderer/components/song/context-menu/items/PlayNext";
import SongItem from "@renderer/components/song/song-item/SongItem";
import SongListSearch from "@renderer/components/song/song-list-search/SongListSearch";
import { songsSearch } from "./song-list.utils";
import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SearchQueryError } from "@shared/types/search-parser.types";

export type SongViewProps = {
  isAllSongs?: boolean;
  isQueue?: boolean;
  playlist?: string;
};

const DEFAULT_TAGS_VALUE: Tag[] = [];
const DEFAULT_ORDER_VALUE: Order = { option: "title", direction: "asc" };

const SongList: Component<SongViewProps> = (props) => {
  const [tags, setTags] = createSignal(DEFAULT_TAGS_VALUE, { equals: false });
  const [order, setOrder] = createSignal(DEFAULT_ORDER_VALUE);
  const [count, setCount] = createSignal(0);
  const [isQueueExist, setIsQueueExist] = createSignal(false);

  const [payload, setPayload] = createSignal<SongsQueryPayload>({
    view: props,
    order: DEFAULT_ORDER_VALUE,
    tags: DEFAULT_TAGS_VALUE,
  });

  const [searchError, setSearchError] = createSignal<Optional<SearchQueryError>>(none(), {
    equals: false,
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
      tags: t,
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
      ...payload(),
    });
    setIsQueueExist(true);
  };

  const group = namespace.create(true);

  return (
    <div class="flex h-full flex-col">
      <div class="sticky top-0 z-10">
        <SongListSearch
          tags={[tags, setTags]}
          setOrder={setOrder}
          count={count}
          error={searchError}
        />
      </div>

      <div class="flex-grow overflow-y-auto p-5 py-0">
        <InfiniteScroller
          apiKey={"query::songsPool"}
          apiData={payload()}
          apiInitKey={"query::songsPool::init"}
          apiInitData={payload()}
          setCount={setCount}
          reset={resetListing}
          fallback={<div class="py-8 text-center text-text">No songs...</div>}
          builder={(s) => (
            <div>
              <SongItem
                song={s}
                group={group}
                onSelect={createQueue}
                contextMenu={
                  <SongContextMenu>
                    <PlayNext path={s.path} disabled={!isQueueExist()} />
                    <AddToPlaylist path={s.path} />
                  </SongContextMenu>
                }
              ></SongItem>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SongList;
