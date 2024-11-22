import { Song } from "../../../../../@types";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import scrollIfNeeded from "../../../lib/tungsten/scroll-if-needed";
import InfiniteScroller from "../../InfiniteScroller";
import AddToPlaylist from "../context-menu/items/AddToPlaylist";
import SongItem from "../song-item/SongItem";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import { DeleteIcon } from "lucide-solid";
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
    <div class="flex w-full flex-col">
      <div class="flex items-center justify-between px-5 pb-2 pt-5">
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
              onSelect={() => window.api.request("queue::play", s.path)}
              onDrop={onDrop(s)}
              contextMenu={<QueueContextMenuContent song={s} />}
            />
          )}
        />
      </div>
    </div>
  );
};

type QueueContextMenuContentProps = { song: Song };
const QueueContextMenuContent: Component<QueueContextMenuContentProps> = (props) => {
  return (
    <DropdownList class="w-52">
      <AddToPlaylist song={props.song} />
      <DropdownList.Item
        onClick={() => window.api.request("queue::removeSong", props.song.path)}
        class="text-danger"
      >
        <span>Remove from queue</span>
        <DeleteIcon class="opacity-80" size={20} />
      </DropdownList.Item>
    </DropdownList>
  );
};

export default SongQueue;
