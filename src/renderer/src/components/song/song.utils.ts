import { delay } from "@renderer/lib/delay";
import { none, some } from "@renderer/lib/rust-like-utils-client/Optional";
import { isSongUndefined, msToBPM } from "@renderer/lib/song";
import { createEffect, createSignal } from "solid-js";
import { AudioSource, Optional, Song } from "src/@types";

/** Range from 0 to 1. */
export type ZeroToOne = number;

const DEFAULT_SONG: Song = {
  dateAdded: "",
  ctime: "",
  path: "",
  audio: "",
  bg: "",
  osuFile: "",
  title: "",
  artist: "",
  creator: "",
  duration: 0,
  bpm: [],
  diffs: [],
};

// ------------
// State
// ------------
const [media, setMedia] = createSignal<URL>();
export { media, setMedia };

const [song, setSong] = createSignal<Song>(DEFAULT_SONG);
export { song, setSong };

const [duration, setDuration] = createSignal(0);
export { duration, setDuration };

const [timestamp, setTimestamp] = createSignal(0);
export { timestamp, setTimestamp };

const [valueBeforeMute, setValueBeforeMute] = createSignal<number | undefined>();
export { valueBeforeMute, setValueBeforeMute };

const [isSeeking, setIsSeeking] = createSignal({
  value: false,
  pausedSeekingStart: false,
});
export { isSeeking, setIsSeeking };

const [volume, _setVolume] = createSignal<ZeroToOne>(0.3);
export const setVolume = (newValue: ZeroToOne) => {
  _setVolume(newValue);
  setValueBeforeMute(undefined);
};

const [speed, _setSpeed] = createSignal<ZeroToOne>(1);
export const setSpeed = (newValue: ZeroToOne) => {
  _setSpeed(newValue);
  player.playbackRate = newValue;
};
export { volume, speed };

let bgPath: Optional<string>;

const player = new Audio();

// Initialize settings
window.api.request("settings::get", "volume").then((v) => {
  if (v.isNone) return;
  setVolume(v.value);
});

window.api.request("settings::get", "audioDeviceId").then((v) => {
  if (v.isNone) return;
  changeAudioDevice(v.value);
});

player.volume = volume();

const [bpm, setBPM] = createSignal<Optional<number>>(none(), {
  equals: (prev, next) => {
    if (prev.isNone && !next.isNone) return true;
    if (!prev.isNone && next.isNone) return true;
    if (!prev.isNone && !next.isNone) return prev.value !== next.value;
    return true;
  },
});
export { bpm };

const [isPlaying, setIsPlaying] = createSignal<boolean>(false);
export { isPlaying };

async function getCurrent(): Promise<{ song: Song; media: URL } | undefined> {
  const song = await window.api.request("queue::current");
  if (song.isNone) return;

  const resource = await window.api.request("resource::getPath", song.value.audio);
  if (resource.isError) return;

  return {
    song: song.value,
    media: new URL(resource.value),
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

  const currentSong = song();

  const m = media();
  if (m !== undefined && player.src !== m.href) {
    player.src = m.href;
  }

  setIsPlaying(true);
  await player.play().catch((reason) => console.error(reason));

  await setMediaSession(currentSong);

  await window.api.request("discord::play", currentSong, player.currentTime);
  document.title = `${currentSong.artist} - ${currentSong.title}`;
}

export async function pause() {
  const currentSong = song();
  setIsPlaying(false);
  player.pause();
  await window.api.request("discord::pause", currentSong);
}

export async function changeAudioDevice(deviceId: string) {
  await window.api.request("settings::write", "audioDeviceId", deviceId);
  if ("setSinkId" in player && typeof player.setSinkId === "function") {
    player.setSinkId(deviceId);
  } else {
    console.error("Changing audio devices is not supported in your environment.");
  }
}

export async function next() {
  await window.api.request("queue::next");
  const current = await getCurrent();
  if (current === undefined) {
    console.error("Can't forward queue");
    return;
  }

  player.src = current.media.href;
  setMedia(current.media);
  setSong(current.song);

  if (isPlaying()) {
    await play();
  } else {
    await setMediaSession(current.song);
  }
}

export async function previous() {
  await window.api.request("queue::previous");
  const current = await getCurrent();
  if (current === undefined) {
    console.error("Can't rollback queue");
    return;
  }

  player.src = current.media.href;
  setMedia(current.media);
  setSong(current.song);

  if (isPlaying()) {
    await play();
  } else {
    await setMediaSession(current.song);
  }
}

export async function togglePlay(force?: boolean): Promise<void> {
  if (force !== undefined) {
    if (force === true) {
      await play();
      return;
    }
    await pause();
    return;
  }

  if (isPlaying()) {
    await pause();
    return;
  }

  await play();
}

export async function seek(range: ZeroToOne): Promise<void> {
  if (isNaN(player.duration)) {
    return;
  }

  const newTime = range * duration();
  player.currentTime = newTime;
  setTimestamp(newTime);
}

// Media Session functions
async function setMediaSession(song: Song) {
  bgPath = await window.api.request("resource::getMediaSessionImage", song.bg!);
  if (bgPath.isNone) return;

  if ("mediaSession" in navigator) {
    await setMediaSessionMetadata();
    setMediaSessionPosition();

    const actionHandlers = {
      play: () => togglePlay(),
      pause: () => pause(),
      previoustrack: previous,
      nexttrack: next,
    };

    for (const [action, handler] of Object.entries(actionHandlers)) {
      try {
        navigator.mediaSession.setActionHandler(
          action as MediaSessionAction,
          handler as MediaSessionActionHandler,
        );
      } catch {
        console.log(`The media session action "${action}" is not supported yet.`);
      }
    }
  }
}

async function setMediaSessionMetadata() {
  if (bgPath.isNone) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song().title,
    artist: song().artist,
    artwork: [
      { src: bgPath.value, sizes: "96x96", type: "image/png" },
      { src: bgPath.value, sizes: "128x128", type: "image/png" },
      { src: bgPath.value, sizes: "192x192", type: "image/png" },
      { src: bgPath.value, sizes: "256x256", type: "image/png" },
      { src: bgPath.value, sizes: "384x384", type: "image/png" },
      { src: bgPath.value, sizes: "512x512", type: "image/png" },
    ],
  });
}

function setMediaSessionPosition() {
  if ("setPositionState" in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: song().duration,
      playbackRate: player.playbackRate,
      position: player.currentTime,
    });
  }
}

createEffect(() => {
  player.volume = volume();
});

const [writeVolume] = delay(async (volume: number) => {
  await window.api.request("settings::write", "volume", volume);
}, 200);
createEffect(async () => {
  const v = volume();
  writeVolume(v);
});

export const saveLocalVolume = async (localVolume: ZeroToOne, song: Song) => {
  if (isSongUndefined(song) || localVolume === 0.5) return;

  const audio = (await window.api.request(
    "resource::get",
    song.audio,
    "audio",
  )) as Optional<AudioSource>;

  if (!audio.isNone && audio.value.volume === localVolume) return;

  await window.api.request("save::localVolume", localVolume, song.path);
};

// Event Listeners
window.api.listen("queue::songChanged", async (s) => {
  const resource = await window.api.request("resource::getPath", s.audio);
  if (resource.isError) return;

  setMedia(new URL(resource.value));
  setSong(s);
  await window.api.request("discord::play", s);
  await play();
  player.playbackRate = speed();
});

player.addEventListener("ended", async () => {
  if (isSeeking().value) {
    return;
  }

  await next();
});

const OFFSET = 0;
const BPM = 1;

player.addEventListener("loadedmetadata", () => {
  setDuration(player.duration);
});
player.addEventListener("timeupdate", async () => {
  setTimestamp(player.currentTime);
  const currentSong = song();

  // Discord
  await window.api.request("discord::play", currentSong, player.currentTime);

  // Media session
  setMediaSessionPosition();

  if (isSongUndefined(currentSong) || currentSong.bpm[0]?.[OFFSET] / 1000 > player.currentTime) {
    return;
  }

  const bpmOpt = currentBPM(player.currentTime, currentSong.bpm);
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

export const handleSeekStart = () => {
  setIsSeeking({
    value: true,
    pausedSeekingStart: player.paused,
  });

  player.pause();
};

export const handleSeekEnd = () => {
  const pausedSeekingStart = isSeeking().pausedSeekingStart;

  setIsSeeking({
    value: false,
    pausedSeekingStart: false,
  });

  if (player.duration === player.currentTime) {
    next();
    return;
  }

  if (!pausedSeekingStart) {
    player.play();
  }
};

export const handleMuteSong = () => {
  const vBeforeMute = valueBeforeMute();
  if (typeof vBeforeMute !== "undefined") {
    _setVolume(vBeforeMute);
    setValueBeforeMute(undefined);
    return;
  }

  setValueBeforeMute(volume());
  _setVolume(0);
};
