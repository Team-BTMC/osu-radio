import { Song } from "../../../../../@types";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import scrollIfNeeded from "../../../lib/tungsten/scroll-if-needed";
import InfiniteScroller from "../../InfiniteScroller";
import SongContextMenu from "../context-menu/SongContextMenu";
import SongContextMenuItem from "../context-menu/SongContextMenuItem";
import SongItem from "../song-item/SongItem";
import { setSongQueueModalOpen } from "./song-queue.utils";
import Button from "@renderer/components/button/Button";
import { DeleteIcon, PlusIcon } from "lucide-solid";
import { Component, createSignal, onCleanup, onMount } from "solid-js";

const SongQueue: Component = () => {
  const [count, setCount] = createSignal(0);
  const showSignal = createSignal(false);
  const [song, setSong] = createSignal<Song>();
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
    <div ref={view} class="flex h-full flex-col bg-regular-material backdrop-blur-md">
      <div class="sticky top-0 z-10 flex items-center justify-between p-5">
        <h2 class="text-lg font-semibold">Next songs on the queue ({count()})</h2>
        <Button variant="ghost" onClick={handleCloseButtonClick}>
          <i class="ri-close-line" />
        </Button>
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
              showSignal={showSignal}
              setSong={setSong}
            ></SongItem>
          )}
        />
      </div>
      <SongContextMenu show={showSignal}>
        <SongContextMenuItem
          onClick={() => {
            console.log("todo");
          }}
        >
          <p>Add to playlist</p>
          <PlusIcon />
        </SongContextMenuItem>

        <SongContextMenuItem
          onClick={() => {
            window.api.request("queue::removeSong", song()?.path);
          }}
        >
          <p>Remove from queue</p>
          <DeleteIcon />
        </SongContextMenuItem>
      </SongContextMenu>
    </div>
  );
};

export default SongQueue;
