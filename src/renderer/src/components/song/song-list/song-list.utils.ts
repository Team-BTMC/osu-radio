import { createSignal } from "solid-js";

const DEFAULT_SONGS_SEARCH_VALUE = "";
const [songsSearch, setSongsSearch] = createSignal(DEFAULT_SONGS_SEARCH_VALUE);
export { songsSearch, setSongsSearch };
