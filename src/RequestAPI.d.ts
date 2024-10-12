import type {
  AudioSource,
  ImageSource,
  InfiniteScrollerInitResponse,
  InfiniteScrollerRequest,
  InfiniteScrollerResponse,
  Optional,
  Playlist,
  PlaylistSongsQueryPayload,
  QueueCreatePayload,
  ResourceID,
  ResourceTables,
  Result,
  Settings,
  Song,
  SongsQueryPayload,
} from "./@types";
import type { SearchQuery } from "./main/lib/search-parser/@search-types";
import type { ConfigError, ConfigSuccess } from "./main/lib/template-parser/parser/TemplateParser";

export type RequestAPI = {
  "resource::get": (
    id: ResourceID,
    table: ResourceTables,
  ) => Optional<Song | AudioSource | ImageSource>;
  "resource::getPath": (id: any) => Result<string, string>;
  "resource::getMediaSessionImage": (bgPath: string) => Optional<string>;

  "queue::exists": () => boolean;
  "queue::current": () => Optional<Song>;
  "queue::duration": () => Optional<number>;
  "queue::remainingDuration": () => Optional<number>;
  "queue::next": () => void;
  "queue::previous": () => void;
  "queue::play": (song: ResourceID) => void;
  "queue::playNext": (song: ResourceID) => void;
  "queue::place": (what: ResourceID, after: ResourceID | undefined) => void;
  "queue::removeSong": (song: ResourceID | undefined) => void;
  "queue::create": (payload: QueueCreatePayload) => void;
  "queue::shuffle": () => void;

  "playlist::add": (playlistName: string, song: Song) => void;
  "playlist::remove": (playlistName: string, song: Song) => void;
  "playlist::create": (name: string) => void;
  "playlist::delete": (name: string) => void;

  "dir::select": () => Optional<string>;
  "dir::autoGetOsuDir": () => Optional<string>;
  "dir::submit": (dir: string) => void;

  "discord::play": (song: Song, duration?: number) => void;
  "discord::pause": (song: Song) => void;

  "error::dismissed": () => void;

  "parse::search": (query: string) => SearchQuery;
  "parse::template": (template: string) => ConfigSuccess | ConfigError;

  "settings::write": <K extends keyof Settings>(key: K, value: any) => void;
  "settings::get": <K extends keyof Settings>(key: K) => Optional<any>;

  "os::platform": () => NodeJS.Platform;

  "window::close": () => void;
  "window::minimize": () => void;
  "window::maximize": () => void;
  "window::isMaximized": () => boolean;

  "query::songsPool::init": (payload: SongsQueryPayload) => InfiniteScrollerInitResponse;
  "query::songsPool": (
    request: InfiniteScrollerRequest,
    payload: SongsQueryPayload,
  ) => InfiniteScrollerResponse<Song>;
  "query::queue::init": () => InfiniteScrollerInitResponse;
  "query::queue": (request: InfiniteScrollerRequest) => InfiniteScrollerResponse<Song>;
  "query::playlists::init": () => InfiniteScrollerInitResponse;
  "query::playlists": (request: InfiniteScrollerRequest) => InfiniteScrollerResponse<Playlist>;
  "query::playlistSongs::init": (
    payload: PlaylistSongsQueryPayload,
  ) => InfiniteScrollerInitResponse;
  "query::playlistSongs": (
    request: InfiniteScrollerRequest,
    payload: PlaylistSongsQueryPayload,
  ) => InfiniteScrollerResponse<Song>;

  "save::localVolume": (volume: number, song: ResourceID) => void;

  "dev::storeLocation": () => string;
};
