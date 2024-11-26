import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import { addNotice } from "@renderer/components/notice/NoticeContainer";
import {
  noticeError,
  PLAYLIST_SCENE_LIST,
  setCreatePlaylistBoxSong,
  setPlaylistActiveScene,
  setShowPlaylistCreateBox,
} from "@renderer/components/playlist/playlist.utils";
import { setSidebarActiveTab, SIDEBAR_PAGES } from "@renderer/scenes/main-scene/main.utils";
import { CheckIcon, CircleCheckIcon, PlusIcon } from "lucide-solid";
import { Accessor, Component, For, Setter, Show } from "solid-js";
import { Song } from "src/@types";

type PlaylistChooserProps = {
  song: Song;
  playlistNames: string[];
  setShowChooser: Setter<boolean>;
  timeoutId: Accessor<NodeJS.Timeout | undefined>;
  setTimeoutId: Setter<NodeJS.Timeout | undefined>;
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
      description: "Successfully added song to playlist " + name + "!",
      variant: "success",
      icon: <CircleCheckIcon size={20} />,
    });
  };

  const isInPlaylist = (song: Song, playlistName: string) => {
    if (song.playlists === undefined) {
      return false;
    }

    return song.playlists.includes(playlistName);
  };

  return (
    <DropdownList
      onMouseOver={() => {
        clearTimeout(props.timeoutId());
      }}
      onMouseLeave={() => {
        props.setTimeoutId(
          setTimeout(() => {
            props.setShowChooser(false);
          }, 320),
        );
      }}
      class="max-h-72 w-40 overflow-auto pr-1.5"
    >
      <DropdownList.Item
        onClick={() => {
          setCreatePlaylistBoxSong(props.song);
          setShowPlaylistCreateBox(true);
          setSidebarActiveTab(SIDEBAR_PAGES.PLAYLISTS.value);
          setPlaylistActiveScene(PLAYLIST_SCENE_LIST);
        }}
      >
        <span>Create Playlist</span>
        <PlusIcon class="text-subtext" size={20} />
      </DropdownList.Item>
      <For
        fallback={<DropdownList.Item disabled={true}>No playlists...</DropdownList.Item>}
        each={props.playlistNames}
      >
        {(child, index) => (
          <DropdownList.Item
            onClick={() => {
              addToPlaylist(props.playlistNames[index()]);
            }}
          >
            <span>{child}</span>
            <Show when={isInPlaylist(props.song, props.playlistNames[index()])}>
              <CheckIcon class="text-subtext" size={20} />
            </Show>
          </DropdownList.Item>
        )}
      </For>
    </DropdownList>
  );
};

export default PlaylistChooser;
