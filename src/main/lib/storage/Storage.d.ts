import { TableMap } from '../../../@types';
import { Table } from './Table';
export declare class Storage {
    private static cache;
    static getTable<T extends keyof TableMap>(name: T): Table<TableMap[T]>;
    static setTable<T extends keyof TableMap>(name: T, contents: TableMap[T]): Table<TableMap[T]>;
    static removeTable<T extends keyof TableMap>(name: T): void;
}
