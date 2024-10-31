import InfiniteScroller from "../../InfiniteScroller";
import PlaylistCreateBox from "../playlist-create/PlaylistCreateBox";
import PlaylistItem from "../playlist-item/PlaylistItem";
import { namespace } from "@renderer/App";
import Button from "@renderer/components/button/Button";
import Impulse from "@renderer/lib/Impulse";
import { PlusIcon, SearchIcon } from "lucide-solid";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { twMerge } from "tailwind-merge";

const PlaylistList: Component = () => {
  const [, setCount] = createSignal(0);
  const resetListing = new Impulse();
  const [showCreateBox, setShowCreateBox] = createSignal(false);

  const group = namespace.create(true);

  onMount(() => window.api.listen("playlist::resetList", resetListing.pulse.bind(resetListing)));
  onCleanup(() =>
    window.api.removeListener("playlist::resetList", resetListing.pulse.bind(resetListing)),
  );

  return (
    <div class="flex h-full flex-col">
      <div class="z-1 sticky top-0 mx-5 mt-6 flex flex-col">
        <div class="mb-6 flex w-full flex-row items-center">
          <div class="mr-2 h-11 w-full rounded-lg border border-stroke">
            <input
              class="h-11 w-full rounded-lg bg-transparent pl-3 focus:outline-none focus:ring-2 focus:ring-accent"
              type="text"
              id="search_input"
              placeholder="Search in your playlists... (WIP)"
            />
            <label
              class={twMerge(
                "absolute top-1/2 -translate-x-8 -translate-y-[22px] transform text-xl text-text",
                showCreateBox() && "-translate-y-[116px]",
              )}
              for="search_input"
            >
              <SearchIcon size={20} />
            </label>
          </div>
          <div class="ml-3">
            {/* // TODO: fix button misaligning when the scrollbar appears */}
            <Button
              onClick={() => {
                setShowCreateBox(!showCreateBox());
              }}
              class="rounded-lg text-xl"
              variant={showCreateBox() ? "primary" : "ghost"}
              size={"icon"}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
        <Show when={showCreateBox() === true}>
          <PlaylistCreateBox group={group} isOpen={setShowCreateBox} reset={resetListing} />
        </Show>
      </div>

      <div class="flex flex-grow overflow-auto">
        <InfiniteScroller
          apiKey={"query::playlists"}
          apiInitKey={"query::playlists::init"}
          setCount={setCount}
          reset={resetListing}
          fallback={<div>No playlists...</div>}
          class="mx-5 my-6 flex w-full flex-col gap-4"
          builder={(s) => (
            <PlaylistItem playlist={s} group={group} reset={resetListing}></PlaylistItem>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistList;
