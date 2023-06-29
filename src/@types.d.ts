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


export type WatchFile = {
  /** Only file name, not absolute path */
  fileName: string,
  ctime: string
};


export type Song = {
  /** Path to audio source (unique factor) */
  id: string,

  audio?: WatchFile & { volume?: number },
  bg?: WatchFile,
  config?: WatchFile,
  dir: string,

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
  tags: string[],
  bpm: number
};


export type Settings = {
  volume: number,
  osuSongsDir: string,
};


type OmitPropsWithReturnType<O extends { [K: string]: (...args: unknown[]) => unknown }, V> = {
  [K in keyof O as ReturnType<O[K]> extends V ? never : K]: O[K]
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



export type RequestAPI = {
  queueCurrent: () => Song,
  queueNext: () => void,
  queuePrevious: () => void,
  dirSelect: () => Optional<string>,
  dirSubmit: (dir: string) => void,
  errorDismissed: () => void,
}



export type LoadingSceneUpdate = {
  current: number,
  hint?: string,
  max?: number
}

export type Scenes = "loading" | "dir-select" | "main" | "error";

export type ListenAPI = {
  changeScene: (scene: Scenes) => void,
  loadingSetTitle: (title: string) => void;
  loadingUpdate: (update: LoadingSceneUpdate) => void,
  errorSetMessage: (msg: string) => void;
}