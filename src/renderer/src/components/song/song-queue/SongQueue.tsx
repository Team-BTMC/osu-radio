import { Song } from "../../../../../@types";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import scrollIfNeeded from "../../../lib/tungsten/scroll-if-needed";
import InfiniteScroller from "../../InfiniteScroller";
import SongContextMenuItem from "../context-menu/SongContextMenuItem";
import SongItem from "../song-item/SongItem";
import Tabs from "@renderer/components/tabs/Tabs";
import { TABS } from "@renderer/scenes/main-scene/main.utils";
import { Component, createSignal, onCleanup, onMount } from "solid-js";

const SongQueue: Component = () => {
  const [count, setCount] = createSignal(0);
  const resetListing = new Impulse();
  const group = namespace.create(true);
  let view: HTMLDivElement | undefined;

  const onSongsLoad = async () => {
    if (!view) {
      return;
    }

    const song = await window.api.request("queue::current");

    if (song.isNone) {
      return;
    }

    changeSongHighlight(song.value);
  };

  const onDrop = (s: Song) => {
    return async (before: Element | null) => {
      await window.api.request(
        "queue::place",
        s.path,
        (before as HTMLElement | null)?.dataset.path,
      );
    };
  };

  const changeSongHighlight = (song: Song): void => {
    if (view === undefined) {
      return;
    }

    const selected = view.querySelector<HTMLElement>(".song-item.selected");
    if (selected !== null && selected.dataset.path !== song.path) {
      selected.classList.remove("selected");
    }

    const path = song.path.replaceAll('"', '\\"').replaceAll("\\", "\\\\");
    const element = view.querySelector<HTMLElement>(`.song-item[data-path="${path}"]`);
    element?.classList.add("selected");

    if (element === null) {
      return;
    }

    const list = element.closest<HTMLElement>(".list");

    if (list === null) {
      return;
    }

    scrollIfNeeded(element, list);
  };

  onMount(() => {
    window.api.listen("queue::created", resetListing.pulse.bind(resetListing));
    window.api.listen("queue::songChanged", changeSongHighlight);
  });

  onCleanup(() => {
    window.api.removeListener("queue::created", resetListing.pulse.bind(resetListing));
    window.api.removeListener("queue::songChanged", changeSongHighlight);
  });

  return (
    <Tabs.Content value={TABS.QUEUE.value} ref={view} class="flex h-full flex-col">
      <div class="sticky top-0 z-10 flex items-center justify-between px-5 pb-2 pt-5">
        <h2 class="text-sm font-bold">
          <span>Next songs on the queue</span>
          <span class="text-subtext"> ({count()})</span>
        </h2>
      </div>

      <div class="flex-grow overflow-y-auto px-4">
        <InfiniteScroller
          apiKey={"query::queue"}
          apiInitKey={"query::queue::init"}
          setCount={setCount}
          reset={resetListing}
          onLoadItems={onSongsLoad}
          fallback={<div class="py-8 text-center text-subtext">No queue...</div>}
          builder={(s) => (
            <SongItem
              song={s}
              group={group}
              selectable={true}
              draggable={true}
              onSelect={() => window.api.request("queue::play", s.path)}
              onDrop={onDrop(s)}
            >
              <SongContextMenuItem onClick={() => window.api.request("queue::removeSong", s.path)}>
                Remove from queue
              </SongContextMenuItem>
            </SongItem>
          )}
        />
      </div>
    </Tabs.Content>
  );
};

export default SongQueue;
