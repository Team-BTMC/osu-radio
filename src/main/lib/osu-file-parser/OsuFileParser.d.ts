import { Optional, Result, Song } from '../../../@types';
import { Signal } from '../Signal';
export declare class OsuFileParser {
    private readonly file;
    private audioSourceToken;
    private constructor();
    static new(file: string): Optional<OsuFileParser>;
    static parseSong(osuFile: string, obj: any): Promise<Result<Song, string>>;
    static parseDir(dir: string, update?: Signal<{
        i: number;
        total: number;
    }>): Promise<Result<Map<string, Song>, string>>;
    getAudioSource(): Optional<string>;
    parseFile(): Promise<Result<Song, string>>;
}
