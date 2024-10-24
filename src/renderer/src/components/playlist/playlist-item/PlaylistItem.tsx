import SongImage from "../../song/SongImage";
import {
  PLAYLIST_SCENE_SONGS,
  setActivePlaylistName,
  setPlaylistActiveScene,
} from "../playlist-view/playlist-view.utils";
import ContextMenuBox from "./ContextMenuBox";
import { getSongImage, renamePlaylist } from "./playlist-item.utils";
import Button from "@renderer/components/button/Button";
import Impulse from "@renderer/lib/Impulse";
import { EllipsisVerticalIcon } from "lucide-solid";
import { Component, createSignal, Match, Show, Switch } from "solid-js";
import { Playlist } from "src/@types";

export type PlaylistItemProps = {
  playlist: Playlist;
  group: string;
  reset: Impulse;
};

const PlaylistItem: Component<PlaylistItemProps> = (props) => {
  const [showBox, setShowBox] = createSignal(false);
  const [playlistName, setPlaylistName] = createSignal("");
  const [editMode, setEditMode] = createSignal(false);

  return (
    <div
      onClick={() => {
        if (!editMode()) {
          setActivePlaylistName(props.playlist.name);
          setPlaylistActiveScene(PLAYLIST_SCENE_SONGS);
        }
      }}
      class=""
    >
      <div class="flex flex-row gap-4">
        <div class="flex items-center justify-center rounded-lg">
          <SongImage
            src={getSongImage(props.playlist)}
            group={props.group}
            class="h-[71px] w-[71px] rounded-lg bg-cover bg-center"
          />
        </div>

        <div class="ml-[6px] flex w-full flex-row items-center justify-between">
          <div class="flex flex-col justify-center text-base font-medium text-text">
            {/* <h3 class="text-3xl font-bold">{props.playlist.name}</h3> */}
            <Switch fallback={""}>
              <Match when={editMode() === true}>
                <input
                  class="h-10 rounded-full border border-stroke bg-transparent pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
                  type="text"
                  id="playlist_name"
                  value={props.playlist.name}
                  onInput={(e) => {
                    setPlaylistName(e.target.value);
                  }}
                  onKeyPress={async (e) => {
                    if (e.key == "Enter") {
                      await renamePlaylist(props.playlist.name, playlistName());
                      setEditMode(false);
                      props.reset.pulse();
                    }
                  }}
                />
              </Match>
              <Match when={editMode() === false}>
                <h3 class="text-3xl font-bold">{props.playlist.name}</h3>
              </Match>
            </Switch>
            <p>{props.playlist.count} songs</p>
            {/* <p>{formatPlaylistTime(Math.round(props.playlist.length))}</p> */}
          </div>
          <Button
            variant={"ghost"}
            // variant={check() ? "accent" : "ghost"}
            size={"icon"}
            class=""
            classList={{ "bg-accent text-thick-material": false }}
            // onClick={(e) => deletePlaylist(e, props)}
            onClick={(e) => {
              e.stopPropagation();
              setShowBox(!showBox());
            }}
          >
            <EllipsisVerticalIcon />
          </Button>
        </div>

        <div class="fixed left-[460px] mt-7">
          <Show when={showBox() === true}>
            <ContextMenuBox playlistItem={props} editSignal={setEditMode} />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
