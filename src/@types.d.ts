import type { SongViewProps } from './renderer/src/components/song/SongView';
import type { SearchQuerySuccess } from './main/lib/search-parser/@search-types';
import { ConfigItem } from './main/lib/template-parser/parser/TemplateParser';
import { RequestAPI } from './RequestAPI';
import { ListenAPI } from './ListenAPI';



declare global {
  interface Window {
    api: {
      request<E extends keyof RequestAPI>(event: E, ...data: Parameters<RequestAPI[E]>): Promise<ReturnType<RequestAPI[E]>>,
      listen<E extends keyof ListenAPI>(channel: E, listener: APIListener<ListenAPI[E]>): void,
      removeListener<E extends keyof ListenAPI>(channel: E, listener: APIListener<ListenAPI[E]>): void,
    }
  }
}



export type Optional<T> = {
  value: T,
  isNone: false;
} | {
  isNone: true
}

export type Result<T, E> = {
  value: T,
  isError: false,
} | {
  error: E,
  isError: true
}



/** result of absolute file path being hashed (64-bit) */
export type ResourceID = string;

export type Resource = {
  /** `osuDir/path` = absolute path */
  path: ResourceID;
  ctime: string;
}

export type AudioSource = {
  songID: ResourceID;
  volume?: number;

  //todo audio file waveform
} & Resource

export type ImageSource = {
  songID: ResourceID;

  //todo prominent colors of image
} & Resource

export type Song = {
  audio: ResourceID,
  bg?: ResourceID,

  dateAdded: string,

  title: string,
  artist: string,
  creator: string,
  bpm: number[][],
  duration: number,
  beatmapSetID?: number,

  mode?: number,
  titleUnicode?: string,
  artistUnicode?: string,
  tags?: string[],

  diffs: string[],
} & Resource

export type SongIndex = {
  id: string,
  t: string, // title
  a: string, // artist
  c: string, // creator
  m?: number, // mode
  d: number, // duration
  tags?: string[],
  diffs: string[],
  bpm: number
}



export type System = {
  indexes: SongIndex[],
  allTags: { [key: string]: string[] },
}

export type Settings = {
  volume: number,
  audioDeviceId: string,
  osuSongsDir: string,
  "window.width": number,
  "window.height": number,
  "window.isMaximized": boolean,
  templateConfig: ConfigItem[],
}



export type TableMap = {
  'songs': { [key: ResourceID]: Song },
  'audio': { [key: ResourceID]: AudioSource },
  'images': { [key: ResourceID]: ImageSource },
  'playlists': { [key: string]: ResourceID[] },
  'settings': Settings,
  'system': System,
}

export type ResourceTables = "songs" | "audio" | "images";



type OmitPropsWithReturnType<O extends { [K: string]: (...args: any[]) => any }, V> = {
  [K in keyof O as ReturnType<O[K]> extends V ? never : K]: O[K]
}

type OmitPropsWithoutReturnType<O extends { [K: string]: (...args: any[]) => any }, V> = {
  [K in keyof O as ReturnType<O[K]> extends V ? K : never]: O[K]
}


export type APIFunction<F extends (...args: any) => any> = (evt: Electron.IpcMainInvokeEvent, ...args: Parameters<F>) => ReturnType<F> | Promise<ReturnType<F>>

export type PacketType = 'DATA' | 'ERROR'

export type Packet<T> = {
  type: PacketType,
  data: T,
  token: string,
  channel: string,
  reason?: string,
}

export type APIListener<F extends (...args: any) => any> = (...args: Parameters<F>) => ReturnType<F> | Promise<ReturnType<F>>



export type Tag = {
  name: string,
  isSpecial?: boolean
}

export type SongsQueryPayload = {
  view: SongViewProps,
  searchQuery?: SearchQuerySuccess,
  tags: Tag[],
  order: string,
}

export type QueueView = SongViewProps & { playlists?: string[] };

export type QueueCreatePayload = {
  view: QueueView,
  searchQuery?: SearchQuerySuccess,
  tags: Tag[],
  order: string,
  startSong: ResourceID,
}

export type OsuSearchAbleProperties = "bpm" | "artist" | "creator" | "length" | "mode" | "title" | "diff";



export type LoadingSceneUpdate = {
  current: number,
  hint?: string,
  max?: number
}

export type Scenes = "" | "loading" | "dir-select" | "main" | "error";