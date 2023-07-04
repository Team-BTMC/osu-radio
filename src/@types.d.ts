import type { InfiniteScrollerResponse } from './renderer/src/components/InfiniteScroller';
import type { SongViewProps } from './renderer/src/components/song/SongView';



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

export type WatchFile = {
  /** Only file name, not absolute path */
  fileName: string,
  ctime: string
};

export type AudioSource = {
  /** `osuDir/path` = absolute path */
  id: ResourceID;
  path: string;
  ctime: string;

  volume?: number;
  //todo audio file waveform
};

export type ImageSource = {
  /** `osuDir/path` = absolute path */
  id: ResourceID;
  path: string;
  ctime: string;

  //todo prominent colors of image
}

export type Song = {
  /** hashed path to config source (unique factor) */
  id: ResourceID,
  audio: ResourceID,
  bg?: ResourceID,


  /* todo instead of config and dir
      path: string;
      ctime: string;
  */
  config: WatchFile,
  dir: string;

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
};

export type SongIndex = {
  id: string,
  t: string,
  a: string,
  c: string,
  tags?: string[],
  bpm: number
};



export type System = {
  indexes: SongIndex[],
  allTags: { [key: string]: string[] }
}

export type Settings = {
  volume: number,
  osuSongsDir: string,
};



export type TableMap = {
  'songs': { [key: ResourceID]: Song },
  'audio': { [key: ResourceID]: AudioSource },
  'images': { [key: ResourceID]: ImageSource },
  'playlists': { [key: string]: ResourceID[] },
  'settings': Settings,
  'system': System,
}

export type ResourceTables = /* "songs" | */ "audio" | "images";



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



export type SongsQueryPayload = {
  view: SongViewProps,
  searchQuery: string,
  //todo ordering
}

export type RequestAPI = {
  resourceGet: (id: any, table: ResourceTables) => Result<string, string>,
  queueCurrent: () => Song,
  queueNext: () => void,
  queuePrevious: () => void,
  dirSelect: () => Optional<string>,
  dirSubmit: (dir: string) => void,
  errorDismissed: () => void,
  allSongs: (index: number) => InfiniteScrollerResponse,
  querySongsPool: (payload: SongsQueryPayload) => Optional<Song[]>
}



export type LoadingSceneUpdate = {
  current: number,
  hint?: string,
  max?: number
}

export type Scenes = "" | "loading" | "dir-select" | "main" | "error";

export type ListenAPI = {
  changeScene: (scene: Scenes) => void,
  loadingSetTitle: (title: string) => void;
  loadingUpdate: (update: LoadingSceneUpdate) => void,
  errorSetMessage: (msg: string) => void;
}