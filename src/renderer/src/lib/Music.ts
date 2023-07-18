import { none, some } from "./rust-like-utils-client/Optional.js";
import { AudioSource, Optional, Song } from '../../../@types';
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
let _song = song();
const [duration, setDuration] = createSignal(0);
const [timestamp, setTimestamp] = createSignal(0);

const [volume, setVolume] = createSignal<ZeroToOne>(0.3);
const [localVolume, setLocalVolume] = createSignal<ZeroToOne>(0.5);

function calculateVolume(): number {
  const v = volume();
  return v + ((localVolume() - 0.5) * 2 * v);
}
player.volume = calculateVolume();

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

export { isPlaying, bpm, song, media, duration, timestamp, volume, setVolume, localVolume, setLocalVolume }



async function getCurrent() {
  const song = await window.api.request("queueCurrent");
  const resource = await window.api.request("resourceGetPath", song.audio);

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

  player.volume = calculateVolume();
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
  if (isNaN(player.duration)) {
    return;
  }

  player.currentTime = range * player.duration;

  setDuration(player.duration);
  setTimestamp(player.currentTime);
}



createEffect(async () => {
  _song = song();
  setBPM(none());

  if (_song === undefined) {
    return;
  }

  const audio = await window.api.request("resourceGet", _song.audio, "audio") as Optional<AudioSource>;

  if (audio.isNone) {
    return;
  }

  setLocalVolume(audio.value.volume ?? 0.5);
});

createEffect(() => {
  player.volume = calculateVolume();
});

createEffect(async () => {
  const lv = localVolume();

  if (_song === undefined || lv === 0.5) {
    return;
  }

  const audio = await window.api.request("resourceGet", _song.audio, "audio") as Optional<AudioSource>;

  if (!audio.isNone && audio.value.volume === lv) {
    return;
  }

  await window.api.request("saveLocalVolume", lv, _song.path);
});



window.api.listen("queueIndexMoved", async (s) => {
  const resource = await window.api.request("resourceGetPath", s.audio);

  if (resource.isError) {
    return;
  }

  setMedia(new URL(resource.value));
  setSong(s);
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
