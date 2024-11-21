import { ListenAPI } from "./ListenAPI";
import { RequestAPI } from "./RequestAPI";
import type { SearchQuerySuccess } from "./main/lib/search-parser/@search-types";
import { ConfigItem } from "./main/lib/template-parser/parser/TemplateParser";

declare global {
  interface Window {
    api: {
      request<E extends keyof RequestAPI>(
        event: E,
        ...data: Parameters<RequestAPI[E]>
      ): Promise<ReturnType<RequestAPI[E]>>;
      listen<E extends keyof ListenAPI>(channel: E, listener: APIListener<ListenAPI[E]>): void;
      removeListener<E extends keyof ListenAPI>(
        channel: E,
        listener: APIListener<ListenAPI[E]>,
      ): void;
    };
  }
}

export type Optional<T> =
  | {
      value: T;
      isNone: false;
    }
  | {
      isNone: true;
    };

export type Result<T, E> =
  | {
      value: T;
      isError: false;
    }
  | {
      error: E;
      isError: true;
    };

/** result of absolute file path being hashed (64-bit) */
export type ResourceID = string;

export type Resource = {
  /** `osuDir/path` = absolute path */
  path: ResourceID;
  ctime: string;
};

export type AudioSource = {
  songID: ResourceID;
  volume?: number;
} & Resource;

export type ImageSource = {
  songID: ResourceID;
} & Resource;

export type Song = {
  audio: ResourceID;
  bg?: ResourceID;
  osuFile: string;

  dateAdded: string;

  title: string;
  artist: string;
  creator: string;
  // For the life of me I can't remember why is it 2D array
  bpm: number[][];
  duration: number;
  beatmapSetID?: number;

  mode?: number;
  titleUnicode?: string;
  artistUnicode?: string;
  tags?: string[];

  diffs: string[];

  // Colors
  primaryColor?: string;
  secondaryColor?: string;
} & Resource;

// Serialization is in JSON that's why properties are only single letter
export type SongIndex = {
  id: string;
  // title
  t: string;
  // artist
  a: string;
  // artist
  c: string;
  // mode
  m?: number;
  // duration
  d: number;
  tags?: string[];
  // beatmap difficulty names
  diffs: string[];
  bpm: number;
};

// System table definition
export type System = {
  "songDir.mtime": string;
  indexes: SongIndex[];
  allTags: { [key: string]: string[] };
};

// Settings table definition
export type Settings = {
  volume: number;
  sidebarWidth: number;
  audioDeviceId: string;
  osuSongsDir: string;
  "window.width": number;
  "window.height": number;
  "window.isMaximized": boolean;
  templateConfig: ConfigItem[];
};

// Key is a name of a table. This name is passed to Storage.getTable(name) function to retrieve whole table as an object
export type TableMap = {
  songs: { [key: ResourceID]: Song };
  audio: { [key: ResourceID]: AudioSource };
  images: { [key: ResourceID]: ImageSource };
  colors: { [key: ResourceID]: ColorsSource };
  playlists: { [key: string]: ResourceID[] };
  settings: Settings;
  system: System;
};

// I guess this is definition of all binary blob files that can be access from the database code?
export type BlobMap = {
  times;
};

// Tables that work on ID -> Record relation
export type ResourceTables = "songs" | "audio" | "images";

type OmitPropsWithReturnType<O extends { [K: string]: (...args: any[]) => any }, V> = {
  [K in keyof O as ReturnType<O[K]> extends V ? never : K]: O[K];
};

// Types as functions for type
type OmitPropsWithoutReturnType<O extends { [K: string]: (...args: any[]) => any }, V> = {
  [K in keyof O as ReturnType<O[K]> extends V ? K : never]: O[K];
};

export type APIFunction<F extends (...args: any) => any> = (
  evt: Electron.IpcMainInvokeEvent,
  ...args: Parameters<F>
) => ReturnType<F> | Promise<ReturnType<F>>;

export type PacketType = "DATA" | "ERROR";

export type Packet<T> = {
  type: PacketType;
  data: T;
  token: string;
  channel: string;
  reason?: string;
};

export type APIListener<F extends (...args: any) => any> = (
  ...args: Parameters<F>
) => ReturnType<F> | Promise<ReturnType<F>>;

export type Tag = {
  name: string;
  // Is excluded. Name should be changed to isExcluded in future version
  isSpecial?: boolean;
};

export type OrderOptions = "title" | "artist" | "creator" | "bpm" | "duration" | "dateAdded";

export type OrderDirection = "asc" | "desc";

export type Order = {
  option: OrderOptions;
  direction: OrderDirection;
};

export type SongsQueryPayload = {
  view: SongViewProps;
  searchQuery?: SearchQuerySuccess;
  tags: Tag[];
  order: Order;
};

// Context for backend to use proper database (all songs, current queue, playlist(s))
export type QueueView = SongViewProps & { playlists?: string[] };

export type QueueCreatePayload = {
  view: QueueView;
  searchQuery?: SearchQuerySuccess;
  tags: Tag[];
  order: Order;
  startSong: ResourceID;
};

export type OsuSearchAbleProperties =
  | "bpm"
  | "artist"
  | "creator"
  | "length"
  | "mode"
  | "title"
  | "diff";

export type LoadingSceneUpdate = {
  current: number;
  hint?: string;
  max?: number;
};

export type Scenes = "" | "loading" | "dir-select" | "main" | "error";

export type SongViewProps = {
  isAllSongs?: boolean;
  isQueue?: boolean;
  playlist?: string;
};

export type InfiniteScrollerRequest = {
  index: number;
  init: number;
  direction: "up" | "down";
};

export type InfiniteScrollerResponse<T = any> = Optional<{
  index: number;
  items: T[];
}>;

export type InfiniteScrollerInitResponse = Optional<{
  initialIndex: number;
  count: number;
}>;
