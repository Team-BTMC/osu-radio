import { addNotice } from "@renderer/components/notice/NoticeContainer";
import { Playlist } from "src/@types";
import { BadgeCheckIcon } from "lucide-solid";
import { noticeError } from "../playlist.utils";
import Impulse from "@renderer/lib/Impulse";

export function getSongImage(playlist: Playlist) {
  const songs = playlist.songs;
  if (songs.length === 0 || songs[0].bg === undefined || songs[0].bg === "") {
    return "";
  } else {
    return songs[0].bg;
  }
}

export function deletePlaylist(name: string, reset: Impulse) {
  window.api.request("playlist::delete", name);
  reset.pulse();
  addNotice({
    variant: "success",
    title: "Playlist deleted",
    description: "Playlist " + name + " successfully deleted!",
    icon: BadgeCheckIcon({ size: 20 }),
  });
}

export const renamePlaylist = async (oldName: string, newName: string) => {
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
};
