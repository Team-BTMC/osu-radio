import InfiniteScroller from "../../InfiniteScroller";
import PlaylistCreateBox from "../playlist-create/PlaylistCreateBox";
import PlaylistItem from "../playlist-item/PlaylistItem";
import { namespace } from "@renderer/App";
import Button from "@renderer/components/button/Button";
import { Input } from "@renderer/components/input/Input";
import Impulse from "@renderer/lib/Impulse";
import { PlusIcon, SearchIcon } from "lucide-solid";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";

const PlaylistList: Component = () => {
  const resetListing = new Impulse();
  const [showCreateBox, setShowCreateBox] = createSignal(false);

  const group = namespace.create(true);

  onMount(() => window.api.listen("playlist::resetList", resetListing.pulse.bind(resetListing)));
  onCleanup(() =>
    window.api.removeListener("playlist::resetList", resetListing.pulse.bind(resetListing)),
  );

  return (
    <div class="flex h-full flex-col">
      <div class="z-1 sticky top-0 mx-5 mb-4 mt-1 flex flex-col">
        <div class="flex w-full flex-row items-center gap-2">
          <div class="relative flex-1">
            <Input
              variant="outlined"
              type="text"
              id="search_input"
              placeholder="Search in your playlists... (WIP)"
            />
            <label
              class="absolute right-3.5 top-1/2 -translate-y-1/2 transform text-xl text-subtext"
              for="search_input"
            >
              <SearchIcon size={20} class="opacity-70" />
            </label>
          </div>
          <Button
            onClick={() => {
              setShowCreateBox(!showCreateBox());
            }}
            class="rounded-lg text-xl"
            variant={showCreateBox() ? "secondary" : "outlined"}
            size="square"
          >
            <PlusIcon size={20} />
          </Button>
        </div>
        <Show when={showCreateBox() === true}>
          <PlaylistCreateBox group={group} isOpen={setShowCreateBox} reset={resetListing} />
        </Show>
      </div>

      <div class="flex flex-grow overflow-auto p-5 py-0">
        <InfiniteScroller
          apiKey={"query::playlists"}
          apiInitKey={"query::playlists::init"}
          reset={resetListing}
          fallback={<div>No playlists...</div>}
          class="flex w-full flex-col gap-4"
          builder={(s) => <PlaylistItem playlist={s} group={group} reset={resetListing} />}
        />
      </div>
    </div>
  );
};

export default PlaylistList;
