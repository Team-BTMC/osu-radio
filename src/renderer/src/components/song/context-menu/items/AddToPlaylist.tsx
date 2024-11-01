import { Song } from "../../../../../../@types";
import SongContextMenuItem from "../SongContextMenuItem";
import { Component, createSignal, onMount } from "solid-js";
import { ChevronRightIcon } from "lucide-solid";
import Popover from "@renderer/components/popover/Popover";
import PlaylistChooser from "./PlaylistChooser";
import SongContextMenu from "../SongContextMenu";

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
    <Popover
      isOpen={showChooser}
      onValueChange={setShowChooser}
      flip={{}}
      shift={{}}
      offset={10}
      placement="right"
    >
      <Popover.Content>
        <SongContextMenu class="max-h-screen overflow-y-scroll overflow-x-hidden [scrollbar-width:none] backdrop-blur-md">
          <PlaylistChooser
            playlistNames={playlistNames()}
            song={props.song}
            setShowChooser={setShowChooser}
            setTimeoutId={setTimeoutId}
            timeoutId={timeoutId}
          />
        </SongContextMenu>
      </Popover.Content>
      <Popover.Trigger>
        <SongContextMenuItem
          onClick={(e) => {
            e.stopPropagation();
          }}
          onHover={() => {
            setShowChooser(true);
            clearTimeout(timeoutId());
          }}
          onHoverEnd={() => {
            setTimeoutId(
              setTimeout(() => {
                setShowChooser(false);
              }, 320),
            );
          }}
        >
          <p>Add to Playlist</p>
          <ChevronRightIcon />
        </SongContextMenuItem>
      </Popover.Trigger>
    </Popover>
  );
};

export default AddToPlaylist;
