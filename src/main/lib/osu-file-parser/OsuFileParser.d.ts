import { AudioSource, ImageSource, Optional, ResourceID, Result, Song } from '../../../@types';
import { Signal } from '../Signal';
export type UpdateSignalType = {
    i: number;
    total: number;
    file: string;
};
export type DirParseResult = Promise<Result<[Map<ResourceID, Song>, Map<ResourceID, AudioSource>, Map<ResourceID, ImageSource>], string>>;
export declare class OsuFileParser {
    private readonly file;
    private readonly osuDir;
    private audioSourceToken;
    private constructor();
    static new(file: string, osuDir: string): Optional<OsuFileParser>;
    static parseSong(osuDir: string, osuFile: string, raw: any): Promise<Result<[Song, AudioSource, ImageSource | undefined], string>>;
    static parseDir(dir: string, update?: Signal<UpdateSignalType>): DirParseResult;
    getAudioSource(): Optional<string>;
    parseFile(): Promise<Result<[Song, AudioSource, (ImageSource | undefined)], string>>;
}
