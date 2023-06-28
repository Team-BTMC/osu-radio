import { Optional } from '../../../@types';
export declare class Table<Struct> {
    private readonly path;
    private readonly struct;
    constructor(path: string, struct: Struct);
    get<K extends keyof Struct>(key: K): Optional<Struct[K]>;
    write<K extends keyof Struct>(key: K, content: Struct[K]): void;
    delete<K extends keyof Struct>(key: K): void;
    filePath(): string;
}
