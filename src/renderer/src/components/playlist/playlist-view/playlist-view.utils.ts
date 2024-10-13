import { createSignal } from "solid-js";

const PLAYLIST_SCENE_LIST = 0;
const PLAYLIST_SCENE_CREATE = 1;
const PLAYLIST_SCENE_SONGS = 2;

const [playlistActiveScene, setPlaylistActiveScene] = createSignal(PLAYLIST_SCENE_LIST);
const [activePlaylistName, setActivePlaylistName] = createSignal("");
export { playlistActiveScene, setPlaylistActiveScene };
export { activePlaylistName, setActivePlaylistName };
export { PLAYLIST_SCENE_CREATE, PLAYLIST_SCENE_SONGS, PLAYLIST_SCENE_LIST };