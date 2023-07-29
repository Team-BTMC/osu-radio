import { GLOBAL_ICON_SCALE, namespace } from '../../App';
import SongItem from '../song/SongItem';
import InfiniteScroller from '../InfiniteScroller';
import { createSignal, onCleanup, onMount } from 'solid-js';
import Fa from 'solid-fa';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../../../../@types';
import scrollIfNeeded from '../../lib/tungsten/scroll-if-needed';
import Impulse from '../../lib/Impulse';
import "../../assets/css/queue/queue-view.css";
import SongContextMenuItem from '../song/context-menu/SongContextMenuItem';
import formatTime from '../../lib/time-formatter';
import { orDefault } from '../../lib/rust-like-utils-client/Optional';



const QueueView = () => {
  const [count, setCount] = createSignal(0);
  const [remaining, setRemaining] = createSignal(formatTime(0));
  const [total, setTotal] = createSignal(formatTime(0));
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
      await window.api.request("queue::place", s.path, (before as HTMLElement | null)?.dataset.path);
    }
  };

  const changeSongHighlight = (song: Song): void => {
    if (view === undefined) {
      return;
    }

    const selected = view.querySelector(".song-item.selected");
    if (selected !== null && selected.dataset.path !== song.path) {
      selected.classList.remove("selected");
    }

    const path = song.path
      .replaceAll('"', '\\"')
      .replaceAll('\\', '\\\\');
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



  onMount(() => {
    window.api.listen("queue::created", resetListing.pulse.bind(resetListing));
    window.api.listen("queue::songChanged", changeSongHighlight);
  });

  onCleanup(() => {
    window.api.removeListener("queue::created", resetListing.pulse.bind(resetListing));
    window.api.removeListener("queue::songChanged", changeSongHighlight);
  });



  window.api.listen("queue::created", async () => {
    const t = await window.api.request("queue::duration");
    setTotal(formatTime(orDefault(t, 0) * 1000));
  });

  window.api.listen("queue::songChanged", async () => {
    const r = await window.api.request("queue::remainingDuration");
    setRemaining(formatTime(orDefault(r, 0) * 1000));
  });



  return (
    <div
      ref={view}
      class="song-view"
    >
      <div class={"queue-controls"}>
        <div class={"time"}>
          <span title={"Remaining playback time"}>Remaining {remaining()}</span>
          <span title={"Total playback time"}>Total {total()}</span>
        </div>
        <button onClick={() => window.api.request("queue::shuffle")} disabled={count() === 0}>
          <Fa icon={faShuffle} scale={GLOBAL_ICON_SCALE}/>
        </button>
      </div>

      <InfiniteScroller
        apiKey={"query::queue"}
        apiInitKey={"query::queue::init"}
        setCount={setCount}
        reset={resetListing}
        onLoadItems={onSongsLoad}
        fallback={<div>No queue...</div>}
        builder={s =>
          <SongItem
            song={s}
            group={group}
            selectable={true}
            draggable={true}
            onSelect={() => window.api.request('queue::play', s.path)}
            onDrop={onDrop(s)}
          >
            <SongContextMenuItem onClick={() => window.api.request("queue::removeSong", s.path)}>Remove from queue</SongContextMenuItem>
          </SongItem>
        }
      />
    </div>
  )
}



export default QueueView;