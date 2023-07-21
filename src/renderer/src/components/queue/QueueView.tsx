import { GLOBAL_ICON_SCALE, namespace } from '../../App';
import SongItem from '../song/SongItem';
import InfiniteScroller from '../InfiniteScroller';
import { createSignal, onCleanup, onMount } from 'solid-js';
import ResetSignal from '../../lib/ResetSignal';
import Fa from 'solid-fa';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';



const QueueView = () => {
  const [count, setCount] = createSignal(0);
  const listingReset = new ResetSignal();

  onMount(() => {
    window.api.listen("queue.created", listingReset.reset.bind(listingReset));
  });

  onCleanup(() => {
    window.api.removeListener("queue.created", listingReset.reset.bind(listingReset));
  });

  return (
    <div class="song-view" data-item-group={namespace.create(true)}>
      <div>
        <span>Queue [listening to {count()} songs]</span>
        <button>
          <Fa icon={faShuffle} scale={GLOBAL_ICON_SCALE}/>
        </button>
      </div>

      <InfiniteScroller
        apiKey={"query.queue"}
        initAPIKey={"query.queue.init"}
        setResultCount={setCount}
        reset={listingReset}
        builder={s =>
          <SongItem song={s} onSelect={async (...args) => console.log(...args)}/>
        }
      />
    </div>
  )
}



export default QueueView;