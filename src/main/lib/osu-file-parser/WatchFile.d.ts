import { Result } from "../../../@types";
export declare class WatchFile {
    fileName: string;
    ctime: string;
    private constructor();
    static new(fullyQualifiedPath: string): Result<WatchFile, string>;
}
