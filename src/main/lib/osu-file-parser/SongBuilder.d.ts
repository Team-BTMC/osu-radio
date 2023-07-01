import { Song } from '../../../@types';
export declare class SongBuilder {
    private song;
    set<K extends keyof Song>(key: K, value: Song[K]): SongBuilder;
    build(): Song;
}
