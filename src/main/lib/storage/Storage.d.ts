import { Song, Settings } from "../../../@types";
import { Table } from "./Table";
type TableMap = {
    "songs": {
        [key: string]: Song;
    };
    "playlists": {
        [key: string]: Song[];
    };
    "settings": Settings;
};
export declare class Storage {
    private static cache;
    static getTable<T extends keyof TableMap>(name: T): Table<TableMap[T]>;
    static removeTable<T extends keyof TableMap>(name: T): void;
}
export {};
