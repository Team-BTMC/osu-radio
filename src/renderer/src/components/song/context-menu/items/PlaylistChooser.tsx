import { Component, For, Show } from "solid-js";
import { Song } from "src/@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { noticeError } from "@renderer/components/playlist/playlist.utils";
import { addNotice } from "@renderer/components/notice/NoticeContainer";
import { BadgeCheckIcon, CheckIcon } from "lucide-solid";

type PlaylistChooserProps = {
  song: Song;
  playlistNames: string[];
};

const PlaylistChooser: Component<PlaylistChooserProps> = (props) => {
  const addToPlaylist = async (name: string) => {
    const result = await window.api.request("playlist::add", name, props.song);
    if (result.isError) {
      noticeError(result.error);
      return;
    }
    addNotice({
      title: "Song added",
      description: "Successfully added song to playlist!",
      variant: "success",
      icon: <BadgeCheckIcon size={20} />,
    });
  };

  const isInPlaylist = (song: Song, playlistName: string) => {
    if (song.playlists === undefined) {
      return false;
    }

    return song.playlists.includes(playlistName);
  };

  return (
    <For
      fallback={
        <SongContextMenuItem disabled={true} onClick={() => {}}>
          No playlists...
        </SongContextMenuItem>
      }
      each={props.playlistNames}
    >
      {(child, index) => (
        <SongContextMenuItem
          onClick={() => {
            addToPlaylist(props.playlistNames[index()]);
          }}
        >
          <p>{child}</p>
          <Show when={isInPlaylist(props.song, props.playlistNames[index()])}>
            <CheckIcon size={20} />
          </Show>
        </SongContextMenuItem>
      )}
    </For>
  );
};

export default PlaylistChooser;
