import { Song } from "../../../../../@types";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import scrollIfNeeded from "../../../lib/tungsten/scroll-if-needed";
import InfiniteScroller from "../../InfiniteScroller";
import SongContextMenuItem from "../context-menu/SongContextMenuItem";
import SongItem from "../song-item/SongItem";
import { setSongQueueModalOpen } from "./song-queue.utils";
import "./styles.css";
import IconButton from "@renderer/components/icon-button/IconButton";
import { Component, createSignal, onCleanup, onMount } from "solid-js";

const SongQueue: Component = () => {
  const [count, setCount] = createSignal(0);
  const resetListing = new Impulse();
  const group = namespace.create(true);
  let view;

  const onSongsLoad = async () => {
    if (view === undefined) {
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

    const selected = view.querySelector(".song-item.selected");
    if (selected !== null && selected.dataset.path !== song.path) {
      selected.classList.remove("selected");
    }

    const path = song.path.replaceAll('"', '\\"').replaceAll("\\", "\\\\");
    const element = view.querySelector(`.song-item[data-path="${path}"]`);
    element?.classList.add("selected");

    if (element === null) {
      return;
    }

    const list = element.closest(".list");

    if (list === null) {
      return;
    }

    scrollIfNeeded(element, list);
  };

  const handleCloseButtonClick = () => {
    setSongQueueModalOpen(false);
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
    <div ref={view} class="h-full flex flex-col">
      <div class="sticky top-0 z-10 flex items-center justify-between p-5 bg-black bg-opacity-90 backdrop-blur-md">
        <h2 class="text-lg font-semibold">Next songs on the queue ({count()})</h2>
        <IconButton onClick={handleCloseButtonClick}>
          <i class="ri-close-line" />
        </IconButton>
      </div>

      <div class="flex-grow overflow-y-auto">
        <InfiniteScroller
          apiKey={"query::queue"}
          apiInitKey={"query::queue::init"}
          setCount={setCount}
          reset={resetListing}
          onLoadItems={onSongsLoad}
          fallback={<div class="text-center py-8 text-text-600">No queue...</div>}
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
    </div>
  );
};

export default SongQueue;