import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import { addNotice } from "@renderer/components/notice/NoticeContainer";
import { noticeError } from "@renderer/components/playlist/playlist.utils";
import { BadgeCheckIcon, CheckIcon } from "lucide-solid";
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
    <DropdownList class="w-40">
      <For
        fallback={<DropdownList.Item disabled={true}>No playlists...</DropdownList.Item>}
        each={props.playlistNames}
      >
        {(child, index) => (
          <DropdownList.Item
            onClick={() => {
              addToPlaylist(props.playlistNames[index()]);
            }}
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
          >
            <span>{child}</span>
            <Show when={isInPlaylist(props.song, props.playlistNames[index()])}>
              <CheckIcon size={20} />
            </Show>
          </DropdownList.Item>
        )}
      </For>
    </DropdownList>
  );
};

export default PlaylistChooser;
