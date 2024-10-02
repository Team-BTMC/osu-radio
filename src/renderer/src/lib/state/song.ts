import { createSignal } from "solid-js";
import { Song } from "src/@types";

/** Range from 0 to 1. */
export type VolumeRange = number;

const DEFAULT_SONG: Song = {
  dateAdded: "",
  ctime: "",
  path: "",
  audio: "",
  bg: "",

  artist: "Artist",
  title: "Title",
  creator: "Creator",
  mode: 0,
  duration: 0,

  bpm: [],
  tags: [],
  diffs: []
};

const [media, setMedia] = createSignal<URL>();
export { media, setMedia };

const [song, setSong] = createSignal<Song>(DEFAULT_SONG);
export { song, setSong };

const [duration, setDuration] = createSignal(0);
export { duration, setDuration };

const [timestamp, setTimestamp] = createSignal(0);
export { timestamp, setTimestamp };

const [volume, setVolume] = createSignal<VolumeRange>(0.3);
export { volume, setVolume };

const [localVolume, setLocalVolume] = createSignal<VolumeRange>(0.5);
export { localVolume, setLocalVolume };
