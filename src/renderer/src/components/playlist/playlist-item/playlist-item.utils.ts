import { Playlist } from "src/@types";

export function getSongImage(playlist: Playlist) {
  const songs = playlist.songs;
  if (songs.length === 0 || songs[0].bg === undefined || songs[0].bg === "") {
    return "";
  } else {
    return songs[0].bg;
  }
}
