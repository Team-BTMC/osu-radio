import { Settings, Song, System } from '../../../@types';
import { Table } from './Table';
type TableMap = {
    'songs': {
        [key: string]: Song;
    };
    'playlists': {
        [key: string]: Song[];
    };
    'settings': Settings;
    'system': System;
};
export declare class Storage {
    private static cache;
    static getTable<T extends keyof TableMap>(name: T): Table<TableMap[T]>;
    static setTable<T extends keyof TableMap>(name: T, contents: TableMap[T]): Table<TableMap[T]>;
    static removeTable<T extends keyof TableMap>(name: T): void;
}
export {};
