import { Song } from '../../@types';
export declare function tagsFilter(tags: string[], includes: string[], excludes: string[]): boolean;
export declare function checkConfigChanges(songs: {
    [id: string]: Song;
}): void;
