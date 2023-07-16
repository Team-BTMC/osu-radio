import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { ResourceID, Song } from '../../../../@types';
import { availableResource, getResourcePath } from '../../lib/tungsten/resource';
import { averageBPM } from '../../lib/song';
import defaultBackground from "../../assets/osu-default-background.jpg";
import "../../assets/css/item.css";



const setSourceEvent = "setSource";

const observers = new Map<string, IntersectionObserver>();

type SongItemProps = {
  song: Song,
  onSelect: (songResource: ResourceID) => Promise<void>,
}



const Item: Component<SongItemProps> = props => {
  const [src, setSRC] = createSignal(defaultBackground);

  let item;
  const setSource = evt => {
    setSRC(evt.detail);
    item.removeEventListener(setSourceEvent, setSource);
  };

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
    <div class="item" onClick={() => props.onSelect(props.song.path)} ref={item} data-url={props.song.bg}>
      <div class="image" style={{ 'background-image': `url('${src().replaceAll("'", "\\'")}')` }}></div>
      <div class="column">
        <h3>[{Math.round(60_000 / averageBPM(props.song.bpm, props.song.duration * 1_000))} BPM] {props.song.title}</h3>
        <span>{props.song.artist} // {props.song.creator}</span>
      </div>
    </div>
  );
}

export default Item;