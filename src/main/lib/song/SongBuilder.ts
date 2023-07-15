import { Song } from '../../../@types';



export class SongBuilder {
  private song: any = {};

  set<K extends keyof Song>(key: K, value: Song[K]): SongBuilder {
    this.song[key] = value;
    return this;
  }

  build(): Song {
    return this.song;
  }
}