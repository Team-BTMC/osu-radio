import { Song } from "../../@types";
import { Dispatcher } from "./Dispatcher.js";
type ZeroToOne = number;
export declare class Music {
    static readonly events: Dispatcher<{
        "songChange": Song;
        "timeUpdate": {
            current: number;
            duration: number;
        };
        "bpmUpdate": number | undefined;
    }>;
    static current(): Promise<URL>;
    static play(): Promise<void>;
    static pause(): void;
    static next(): Promise<void>;
    static previous(): Promise<void>;
    static togglePlay(force?: boolean): Promise<void>;
    static isPlaying(): boolean;
    static seek(range: ZeroToOne): void;
}
export {};
