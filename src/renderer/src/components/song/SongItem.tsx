import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { ResourceID, Song } from '../../../../@types';
import { availableResource, getResourcePath } from '../../lib/tungsten/resource';
import { averageBPM, msToBPM } from '../../lib/song';
import defaultBackground from "../../assets/osu-default-background.jpg";
import "../../assets/css/song/song-item.css";
import SongContextMenu from './SongContextMenu';



const setSourceEvent = "setSource";

const observers = new Map<string, IntersectionObserver>();

type SongItemProps = {
  song: Song,
  onSelect: (songResource: ResourceID) => void | Promise<void>,
}



const SongItem: Component<SongItemProps> = props => {
  const [src, setSRC] = createSignal(defaultBackground);
  const showSignal = createSignal(false);
  const [coords, setCoords] = createSignal<[number, number]>([0, 0], { equals: false });

  let item;
  const setSource = evt => {
    setSRC(evt.detail);
    item.removeEventListener(setSourceEvent, setSource);
  };

  const showMenu = (evt: MouseEvent) => {
    setCoords([evt.clientX, evt.clientY]);
    showSignal[1](true);
  }

  onMount(() => {
    item.addEventListener(setSourceEvent, setSource);

    const group = (item as HTMLElement).closest("[data-item-group]")?.getAttribute("data-item-group") ?? "global-item-group";

    let observer = observers.get(group);

    if (observer === undefined) {
      observer = new IntersectionObserver(async entries => {
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting === false) {
            return;
          }

          const resource = await getResourcePath(String(entries[i].target.getAttribute("data-url")));

          entries[i].target.dispatchEvent(new CustomEvent(setSourceEvent, {
            detail: await availableResource(resource, defaultBackground)
          }));

          observer?.unobserve(entries[i].target);
        }
      }, { rootMargin: "50px" });
      observers.set(group, observer);
    }

    observer.observe(item);
  });

  onCleanup(() => {
    item.removeEventListener(setSourceEvent, setSource);
  });

  return (
    <div
      class="song-item"
      onClick={() => props.onSelect(props.song.path)}
      onContextMenu={showMenu}
      ref={item}
      data-url={props.song.bg}
    >
      <div class={"song-item-container"}>
        <div class="image" style={{ 'background-image': `url('${src().replaceAll("'", "\\'")}')` }}></div>
        <div class="column">
          <h3>[{msToBPM(averageBPM(props.song.bpm, props.song.duration * 1_000))} BPM] {props.song.title}</h3>
          <span>{props.song.artist} // {props.song.creator}</span>
        </div>
      </div>

      <SongContextMenu show={showSignal} container={item} coords={coords}>
        <div>Pog</div>
        <div>Nice</div>
        <div>Pretty good right</div>
      </SongContextMenu>
    </div>
  );
}

export default SongItem