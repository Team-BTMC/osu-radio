import { Optional, Order, ResourceID, Song, SongsQueryPayload, Tag } from "../../../../../@types";
import { SearchQueryError } from "../../../../../main/lib/search-parser/@search-types";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import { none, some } from "../../../lib/rust-like-utils-client/Optional";
import InfiniteScroller from "../../InfiniteScroller";
import AddToPlaylist from "../context-menu/items/AddToPlaylist";
import SongItem from "../song-item/SongItem";
import SongListSearch from "../song-list-search/SongListSearch";
import { songsSearch } from "./song-list.utils";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import { ListStartIcon } from "lucide-solid";
import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";

export type SongViewProps = {
  isAllSongs?: boolean;
  isQueue?: boolean;
  playlist?: string;
};

const DEFAULT_TAGS_VALUE: Tag[] = [];
const DEFAULT_ORDER_VALUE: Order = { option: "title", direction: "asc" };

const SongList: Component<SongViewProps> = (props) => {
  const tagsSignal = createSignal(DEFAULT_TAGS_VALUE, { equals: false });
  const [order, setOrder] = createSignal(DEFAULT_ORDER_VALUE);
  const [count, setCount] = createSignal(0);

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
    const t = tagsSignal[0]();
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
  };

  const group = namespace.create(true);

  return (
    <>
      <SongListSearch tags={tagsSignal} setOrder={setOrder} count={count} error={searchError} />

      <div class="flex-grow overflow-y-auto p-5 py-0">
        <InfiniteScroller
          apiKey={"query::songsPool"}
          apiData={payload()}
          apiInitKey={"query::songsPool::init"}
          apiInitData={payload()}
          setCount={setCount}
          reset={resetListing}
          fallback={<div class="py-8 text-center text-lg uppercase text-subtext">No songs</div>}
          builder={(s) => (
            <SongItem
              song={s}
              group={group}
              onSelect={createQueue}
              contextMenu={<SongListContextMenuContent song={s} />}
            />
          )}
        />
      </div>
    </>
  );
};

type SongListContextMenuContentProps = { song: Song };
const SongListContextMenuContent: Component<SongListContextMenuContentProps> = (props) => {
  return (
    <DropdownList class="w-40">
      <AddToPlaylist song={props.song} />
      <DropdownList.Item
        onClick={() => {
          window.api.request("queue::playNext", props.song.path);
        }}
      >
        <span>Play next</span>
        <ListStartIcon class="text-subtext" size={20} />
      </DropdownList.Item>
    </DropdownList>
  );
};

export default SongList;
