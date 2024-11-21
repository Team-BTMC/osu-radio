import { Song } from "../../../../../../@types";
import { Component, createSignal, onMount } from "solid-js";
import Popover from "@renderer/components/popover/Popover";
import PlaylistChooser from "./PlaylistChooser";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import { ChevronRightIcon } from "lucide-solid";

type AddToPlaylistProps = {
  song: Song;
};

const AddToPlaylist: Component<AddToPlaylistProps> = (props) => {
  const [playlistNames, setPlaylistNames] = createSignal<string[]>([]);
  const [showChooser, setShowChooser] = createSignal<boolean>(false);
  const [timeoutId, setTimeoutId] = createSignal<NodeJS.Timeout>();

  onMount(async () => {
    const playlists = await window.api.request("query::playlistNames");
    if (playlists.isNone) {
      return;
    }

    setPlaylistNames(playlists.value.playlistNames);
  });

  return (
    <DropdownList.Item
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        setShowChooser(true);
      }}
      onMouseOver={() => {
        setShowChooser(true);
        clearTimeout(timeoutId());
      }}
      onMouseLeave={() => {
        setTimeoutId(
          setTimeout(() => {
            setShowChooser(false);
          }, 320),
        );
      }}
    >
      <Popover
        isOpen={showChooser}
        onValueChange={setShowChooser}
        flip={{}}
        shift={{}}
        offset={{ mainAxis: 15 }}
        placement="right"
      >
        <Popover.Content>
          <PlaylistChooser
            playlistNames={playlistNames()}
            song={props.song}
            setShowChooser={setShowChooser}
            setTimeoutId={setTimeoutId}
            timeoutId={timeoutId}
          />
        </Popover.Content>
        <span>Add to Playlist</span>
        <ChevronRightIcon class="text-subtext" />
        <Popover.Anchor />
      </Popover>
    </DropdownList.Item>
  );
};

export default AddToPlaylist;
