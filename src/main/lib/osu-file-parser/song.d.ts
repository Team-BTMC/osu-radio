import { Song, SongIndex } from '../../../@types';
export type IndexCallback = (i: number, song: string) => void;
export declare function collectTagsAndIndexSongs(songs: {
    [id: string]: Song;
}, fn?: IndexCallback): [SongIndex[], Map<string, string[]>];
export declare function averageBPM(bpm: number[][], durationMS: number): number;
