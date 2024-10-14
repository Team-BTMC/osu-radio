import InfiniteScroller from "../../InfiniteScroller";
import IconButton from "../../icon-button/IconButton";
import PlaylistCreateBox from "../playlist-create/PlaylistCreateBox";
import PlaylistItem from "../playlist-item/PlaylistItem";
// import {
//   PLAYLIST_SCENE_CREATE,
//   setPlaylistActiveScene,
// } from "../playlist-view/playlist-view.utils";
import { namespace } from "@renderer/App";
import Impulse from "@renderer/lib/Impulse";
import { Component, createSignal, Match, onCleanup, onMount, Switch } from "solid-js";

export type PlaylistListProps = {};

const PlaylistList: Component<PlaylistListProps> = () => {
  // const [playlistSearch, setPlaylistSearch] = createSignal("");
  const [_count, setCount] = createSignal(0);
  const resetListing = new Impulse();
  const [showCreateBox, setShowCreateBox] = createSignal(false);

  const group = namespace.create(true);

  onMount(() => window.api.listen("playlist::resetList", resetListing.pulse.bind(resetListing)));
  onCleanup(() =>
    window.api.removeListener("playlist::resetList", resetListing.pulse.bind(resetListing)),
  );

  return (
    <div class="mx-5 my-6">
      {/* <Search
        query={querySignal}
        tags={tagsSignal}
        setOrder={setOrder}
        count={count}
        error={searchError}
      />
      */}
      <div class="mb-6 flex flex-row items-center">
        <div class="mr-2 flex h-10 flex-1 flex-row items-center justify-between rounded-lg border border-stroke">
          <input
            type="text"
            id="playlist_input"
            class="color-white ml-3 w-full border-none bg-transparent font-[inherit] text-base"
            placeholder="Search in your playlists... (WIP)"
            // onInput={(e) => {
            //   setPlaylistSearch(e.target.value);
            // }}
          />
          <i class="ri-search-line mr-3 text-xl text-text"></i>
        </div>
        <div class="rounded-lg border border-stroke">
          <IconButton
            class="m-0 h-5 w-5 rounded-lg p-[9px] text-xl text-text"
            onClick={() => {
              // setPlaylistActiveScene(PLAYLIST_SCENE_CREATE);
              setShowCreateBox(!showCreateBox());
            }}
            classList={{ "bg-accent text-thick-material": showCreateBox() }}
            data-open={showCreateBox()}
          >
            <i class="ri-add-fill" />
          </IconButton>
        </div>
      </div>

      <div>
        <Switch fallback={""}>
          <Match when={showCreateBox() === true}>
            <PlaylistCreateBox group={group} isOpen={setShowCreateBox} reset={resetListing} />
          </Match>
        </Switch>
        <InfiniteScroller
          apiKey={"query::playlists"}
          apiInitKey={"query::playlists::init"}
          setCount={setCount}
          reset={resetListing}
          fallback={<div>No playlists...</div>}
          class="flex flex-col gap-4"
          builder={(s) => (
            <PlaylistItem playlist={s} group={group} reset={resetListing}></PlaylistItem>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistList;
