import { Component, createEffect, createSignal } from 'solid-js';
import Bar from '../Bar';
import {
  duration,
  seek,
  song,
  timestamp,
} from '../../lib/Music';
import formatTime from '../../lib/time-formatter';
import SongImage from './SongImage';
import "../../assets/css/song/song-detail.css";
import SongControls from './SongControls';



type SongDetailProps = {}



const SongDetail: Component<SongDetailProps> = (_props) => {
  const [bg, setBg] = createSignal<string | undefined>();

  createEffect(() => {
    setBg(song.bg);
  });

  return (
    <div class="song-detail">
      <div class="song">
        <SongImage src={bg} instantLoad={true}/>
        <h3>{song.title}</h3>
        <span>{song.artist}</span>
      </div>

      <div class="seeker">
        <Bar
          fill={timestamp() / (duration() !== 0 ? duration() : 1)}
          setFill={seek}
        />
        <div class="time">
          <span>{formatTime(timestamp() * 1_000)}</span>
          <span>{formatTime(duration() * 1_000)}</span>
        </div>
      </div>

      <SongControls/>
    </div>
  );
};



export default SongDetail;