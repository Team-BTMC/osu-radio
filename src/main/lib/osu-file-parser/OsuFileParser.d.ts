import { Optional, Result, Song } from '../../../@types';
import { Signal } from '../Signal';
export type UpdateSignalType = {
    i: number;
    total: number;
    file: string;
};
export type DirParseResult = Promise<Result<Map<string, Song>, string>>;
export declare class OsuFileParser {
    private readonly file;
    private audioSourceToken;
    private constructor();
    static new(file: string): Optional<OsuFileParser>;
    static parseSong(osuFile: string, obj: any): Promise<Result<Song, string>>;
    static parseDir(dir: string, update?: Signal<UpdateSignalType>): DirParseResult;
    getAudioSource(): Optional<string>;
    parseFile(): Promise<Result<Song, string>>;
}
