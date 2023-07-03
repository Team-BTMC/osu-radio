import { Component, createSignal, onMount } from 'solid-js';
import { Song } from '../../../../@types';
import { availableResource, getResourcePath } from '../../lib/tungsten/resource';
import { averageBPM } from '../../lib/song';
import defaultBackground from "../../assets/osu-default-background.jpg";
import "../../assets/css/item.css";



const Item: Component<{ song: Song }> = props => {
  const [src, setSRC] = createSignal(defaultBackground);

  let item;
  onMount(() => {
    const lazy = new IntersectionObserver(async () => {
      lazy.unobserve(item);
      const resource = await getResourcePath(props.song.bg, "images");
      setSRC(await availableResource(resource, defaultBackground));
    }, { root: item.parentElement, rootMargin: "50px" });

    lazy.observe(item);
  });

  return (
    <div class="item" ref={item}>
      <div class="image" style={{ 'background-image': `url(${src()})` }}></div>
      <div class="column">
        <h3>[{Math.round(60_000 / averageBPM(props.song.bpm, props.song.duration))} BPM] {props.song.title}</h3>
        <span>{props.song.artist}</span>
      </div>
    </div>
  );
}

export default Item;