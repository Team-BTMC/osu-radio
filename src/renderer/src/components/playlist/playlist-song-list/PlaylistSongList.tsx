import InfiniteScroller from "../../InfiniteScroller";
import SongItem from "../../song/song-item/SongItem";
import { Component } from "solid-js";

type PlaylistSongListProps = {
  playlistName: string;
  group: string;
};

const PlaylistSongList: Component<PlaylistSongListProps> = (props) => {
  return (
    <div>
      <InfiniteScroller
        apiKey={"query::playlistSongs"}
        //todo: apiData
        apiInitKey={"query::playlistSongs::init"}
        // setCount={setCount}
        // reset={resetListing}
        // onLoadItems={onSongsLoad}
        fallback={<div>No songs...</div>}
        builder={(s) => (
          <SongItem
            song={s}
            group={props.group}
            selectable={true}
            draggable={true}
            onSelect={() => window.api.request("queue::play", s.path)}
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
