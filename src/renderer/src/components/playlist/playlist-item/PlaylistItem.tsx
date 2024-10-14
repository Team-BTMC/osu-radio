import IconButton from "../../icon-button/IconButton";
import SongImage from "../../song/SongImage";
import {
  PLAYLIST_SCENE_SONGS,
  setActivePlaylistName,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import { deletePlaylist, getSongImage } from "./playlist-item.utils";
import Impulse from "@renderer/lib/Impulse";
import { Component } from "solid-js";
import { Playlist } from "src/@types";

export type PlaylistItemProps = {
  playlist: Playlist;
  group: string;
  reset: Impulse;
};

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
  return (
    <div
      onClick={() => {
        setActivePlaylistName(props.playlist.name);
        setPlaylistActiveScene(PLAYLIST_SCENE_SONGS);
      }}
    >
      <div class="flex flex-row gap-4">
        <div class="rounded-lg">
          <SongImage
            src={getSongImage(props.playlist)}
            group={props.group}
            class="h-[71px] w-[71px] rounded-lg bg-cover bg-center"
          />
        </div>

        <div class="ml-[6px] flex w-full flex-row items-center justify-between">
          <div class="flex flex-col justify-center text-base font-medium text-text">
            <h3 class="text-3xl font-bold">{props.playlist.name}</h3>
            <p>{props.playlist.count} songs</p>
            {/* <p>{formatPlaylistTime(Math.round(props.playlist.length))}</p> */}
          </div>
          <div class="z-[3] flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-stroke text-text">
            <IconButton
              class="rounded-lg"
              classList={{ "bg-accent text-thick-material": false }}
              onClick={(e) => deletePlaylist(e, props)}
              data-open={"false"}
            >
              <i class="ri-more-2-line" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
