import { Song } from "../../../../../../@types";
import PlaylistChooser from "./PlaylistChooser";
import DropdownList from "@renderer/components/dropdown-list/DropdownList";
import Popover from "@renderer/components/popover/Popover";
import { ChevronRightIcon } from "lucide-solid";
import { Component, createSignal, onMount } from "solid-js";

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
        <div class="inline-flex w-full items-center justify-between">
          <span>Add to Playlist</span>
          <ChevronRightIcon class="text-subtext" />
        </div>
        <Popover.Anchor />
      </Popover>
    </DropdownList.Item>
  );
};

export default AddToPlaylist;
