import { BadgeCheckIcon, CircleXIcon } from "lucide-solid";
import { addNotice } from "../notice/NoticeContainer";
import Impulse from "@renderer/lib/Impulse";
import { Song } from "src/@types";
import { createSignal } from "solid-js";

const PLAYLIST_SCENE_LIST = 0;
const PLAYLIST_SCENE_SONGS = 1;

const [playlistActiveScene, setPlaylistActiveScene] = createSignal(PLAYLIST_SCENE_LIST);
const [activePlaylistName, setActivePlaylistName] = createSignal("");
export { playlistActiveScene, setPlaylistActiveScene };
export { activePlaylistName, setActivePlaylistName };
export { PLAYLIST_SCENE_SONGS, PLAYLIST_SCENE_LIST };

export function noticeError(error: string) {
  addNotice({
    title: "Error",
    description: error,
    variant: "error",
    icon: CircleXIcon({ size: 20 }),
  });
}

export async function deletePlaylist(name: string, reset: Impulse) {
  const result = await window.api.request("playlist::delete", name);
  if (result.isError) {
    noticeError(result.error);
  } else {
    reset.pulse();
    addNotice({
      variant: "success",
      title: "Playlist deleted",
      description: "Playlist " + name + " successfully deleted!",
      icon: BadgeCheckIcon({ size: 20 }),
    });
  }
}

export async function renamePlaylist(oldName: string, newName: string) {
  newName = newName.trim();
  if (newName === undefined || newName === "" || newName === oldName) {
    return;
  }

  const result = await window.api.request("playlist::rename", oldName, newName);
  if (result.isError) {
    noticeError(result.error);
    return;
  }

  addNotice({
    title: "Renamed playlist",
    description: "Playlist renamed successfully!",
    variant: "success",
    icon: BadgeCheckIcon({ size: 20 }),
  });
}

export async function deleteSong(playlistName: string, song: Song) {
  const result = await window.api.request("playlist::remove", playlistName, song);
  if (result.isError) {
    noticeError(result.error);
    return;
  }
}
