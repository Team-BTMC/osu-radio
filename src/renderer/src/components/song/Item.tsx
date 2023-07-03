import { Component } from 'solid-js';
import { Song } from '../../../../@types';
import { getResourcePath } from '../../lib/tungsten/resource';
import { averageBPM } from '../../lib/song';



const Item: Component<{ song: Song }> = props => {
  const image = getResourcePath(props.song.bg, "images");

  return (
    <div class="item">
      <img src={image()} alt="art" />
      <div class="column">
        <h3>[{Math.round(60_000 / averageBPM(props.song.bpm, props.song.duration))} BPM] {props.song.title}</h3>
        <span>{props.song.artist}</span>
      </div>
    </div>
  );
}

export default Item;