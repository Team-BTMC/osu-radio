import { addNotice } from "../notice/NoticeContainer";
import Impulse from "@renderer/lib/Impulse";
import { CircleCheckIcon, CircleXIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import { Song } from "src/@types";

const PLAYLIST_SCENE_LIST = 0;
const PLAYLIST_SCENE_SONGS = 1;

const [playlistActiveScene, setPlaylistActiveScene] = createSignal(PLAYLIST_SCENE_LIST);
const [activePlaylistName, setActivePlaylistName] = createSignal("");
const [createPlaylistBoxSong, setCreatePlaylistBoxSong] = createSignal<Song | undefined>(undefined);
const [showPlaylistCreateBox, setShowPlaylistCreateBox] = createSignal(false);

export { playlistActiveScene, setPlaylistActiveScene };
export { activePlaylistName, setActivePlaylistName };
export { createPlaylistBoxSong, setCreatePlaylistBoxSong };
export { showPlaylistCreateBox, setShowPlaylistCreateBox };
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
      icon: CircleCheckIcon({ size: 20 }),
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
    icon: CircleCheckIcon({ size: 20 }),
  });
}

export async function deleteSong(playlistName: string, song: Song) {
  const result = await window.api.request("playlist::remove", playlistName, song);
  if (result.isError) {
    noticeError(result.error);
    return;
  }
}
