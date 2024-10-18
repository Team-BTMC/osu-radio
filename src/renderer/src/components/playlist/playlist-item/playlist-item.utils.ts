import { PlaylistItemProps } from "./PlaylistItem";
import { Playlist } from "src/@types";

export function getSongImage(playlist: Playlist) {
  const songs = playlist.songs;
  if (songs.length === 0 || songs[0].bg === undefined || songs[0].bg === "") {
    return "";
  } else {
    return songs[0].bg;
  }
}

export function deletePlaylist(e: Event, props: PlaylistItemProps) {
  e.stopPropagation();
  window.api.request("playlist::delete", props.playlist.name);
  props.reset.pulse();
}

// function formatPlaylistTime(seconds: number) {
//   let minutes = 0;
//   let hours = 0;
//   if (seconds > 60) {
//     minutes = Math.floor(seconds / 60);
//     if (minutes > 60) {
//       hours = Math.floor(minutes / 60);
//     }
//   }

//   return hours + " hours " + minutes + " minutes";
// }
export const renamePlaylist = async (oldName: string, newName: string) => {
  newName = newName.trim();
  if (newName === undefined || newName === "" || newName === oldName) {
    return;
  }

  await window.api.request("playlist::rename", oldName, newName);
  // reset.pulse();
};
