import { none, some } from "./rust-like-utils-client/Optional.js";
import { Optional, Song } from '../../../@types';
import { msToBPM } from './song';
import { createEffect, createSignal } from 'solid-js';



type ZeroToOne = number;



const player = new Audio();



const [media, setMedia] = createSignal<URL>();
const [song, setSong] = createSignal<Song | undefined>(undefined, {
  equals: (prev, next) => {
    return JSON.stringify(prev) === JSON.stringify(next);
  }
});
const [duration, setDuration] = createSignal(0);
const [timestamp, setTimestamp] = createSignal(0);

const [volume, setVolume] = createSignal(0.3);
player.volume = volume();

const [bpm, setBPM] = createSignal<Optional<number>>(none(), {
  equals: (prev, next) => {
    if (prev.isNone && !next.isNone) {
      return true;
    }

    if (!prev.isNone && next.isNone) {
      return true;
    }

    if (!prev.isNone && !next.isNone) {
      return prev.value !== next.value;
    }

    return true;
  }
});
const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

export { isPlaying, bpm, song, media, duration, timestamp, volume, setVolume }



async function getCurrent() {
  const song = await window.api.request("queueCurrent");
  const resource = await window.api.request("resourceGet", song.audio);

  if (resource.isError) {
    return;
  }

  const media = new URL(resource.value);

  return {
    song,
    media
  };
}

export async function play(): Promise<void> {
  if (media() === undefined) {
    const current = await getCurrent();
    if (current === undefined) {
      console.error("Cannot play current song");
      return;
    }

    setSong(current.song);
    setMedia(current.media);
  }

  const m = media();

  if (m !== undefined && player.src !== m.href) {
    player.src = m.href;
  }

  player.volume = volume();
  setIsPlaying(true);
  await player.play();
}

export function pause() {
  setIsPlaying(false);
  player.pause();
}

export async function next() {
  await window.api.request("queueNext");

  const current = await getCurrent();
  if (current === undefined) {
    console.error("Can't forward queue");
    return;
  }

  player.src = current.media.href;
  setMedia(current.media);

  if (isPlaying() === true) {
    await play();
  }

  setSong(current.song);
}

export async function previous() {
  await window.api.request("queuePrevious");

  const current = await getCurrent();
  if (current === undefined) {
    console.error("Can't rollback queue");
    return;
  }

  player.src = current.media.href;
  setMedia(current.media);

  if (isPlaying() === true) {
    await play();
  }

  setSong(current.song);
}

export async function togglePlay(force?: boolean): Promise<void> {
  if (force !== undefined) {
    if (force === true) {
      await play();
      return;
    }

    pause();
    return;
  }

  if (isPlaying() === true) {
    pause();
    return;
  }

  await play();
}

export function seek(range: ZeroToOne): void {
  player.currentTime = range * player.duration;

  setDuration(player.duration);
  setTimestamp(player.currentTime);
}



createEffect(() => {
  song();
  setBPM(none());
});



window.api.listen("queueIndexMoved", async (s) => {
  const resource = await window.api.request("resourceGet", s.audio);

  if (resource.isError) {
    return;
  }

  setMedia(new URL(resource.value));
  setSong(s);
  console.log(song());
  await play();
});



player.addEventListener("ended", async () => {
    await next();
});

const OFFSET = 0;
const BPM = 1;

player.addEventListener("timeupdate", () => {
  setTimestamp(player.currentTime);
  setDuration(player.duration);

  const s = song();

  if (s === undefined || s.bpm[0][OFFSET] / 1000 > player.currentTime) {
    return;
  }

  const bpmOpt = currentBPM(player.currentTime, s.bpm);
  const current = bpm();

  if (!bpmOpt.isNone && !current.isNone && bpmOpt.value !== current.value) {
    setBPM(some(bpmOpt.value));
  }
});



function currentBPM(offset: number, changes: number[][]): Optional<number> {
    if (changes.length === 0 || offset < changes[0][OFFSET] / 1000) {
        return none();
    }

    for (let i = 1; i < changes.length; i++) {
        if (changes[0][OFFSET] / 1000 <= offset && offset < changes[i][OFFSET] / 1000) {
            return some(msToBPM(changes[i - 1][BPM]));
        }
    }

    return some(msToBPM(changes[changes.length - 1][BPM]));
}
