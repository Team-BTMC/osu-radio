import SongImage from "../../song/SongImage";
import {
  PLAYLIST_SCENE_SONGS,
  setActivePlaylistName,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import { deletePlaylist, getSongImage } from "./playlist-item.utils";
import Button from "@renderer/components/button/Button";
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
          <Button
            variant={"ghost"}
            size={"icon"}
            class="flex items-center justify-center border"
            classList={{ "bg-accent text-thick-material": false }}
            onClick={(e) => deletePlaylist(e, props)}
          >
            <i class="ri-more-2-line" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
