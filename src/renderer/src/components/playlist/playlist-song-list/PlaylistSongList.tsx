import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { PLAYLIST_SCENE_LIST, setPlaylistActiveScene } from "../playlist-view/playlist-view.utils";
import { namespace } from "@renderer/App";
import { Component, createSignal } from "solid-js";
import { PlaylistSongsQueryPayload } from "src/@types";

type PlaylistSongListProps = {
  playlistName: string;
};

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  const group = namespace.create(true);

  const [payload, _setPlayload] = createSignal<PlaylistSongsQueryPayload>({
    playlistName: props.playlistName,
  });

  return (
    <div>
      <button onClick={() => setPlaylistActiveScene(PLAYLIST_SCENE_LIST)}>
        playlist "{props.playlistName}" song list, back (click me)
      </button>
      <InfiniteScroller
        apiKey={"query::playlistSongs"}
        apiData={payload()}
        apiInitKey={"query::playlistSongs::init"}
        apiInitData={payload()}
        // setCount={setCount}
        // reset={resetListing}
        // onLoadItems={onSongsLoad}
        fallback={<div>No songs...</div>}
        builder={(s) => (
          <SongItem
            song={s}
            group={group}
            selectable={true}
            draggable={true}
            onSelect={() => window.api.request("queue::play", s)}
            // onDrop={onDrop(s)}
          >
            {/* <SongContextMenuItem onClick={() => window.api.request("queue::removeSong", s.path)}>
              Remove from queue
            </SongContextMenuItem> */}
          </SongItem>
        )}
      />
    </div>
  );
};

export default PlaylistSongList;
