import { Optional } from '../../../@types';
export declare class Table<S> {
    private readonly path;
    private readonly struct;
    private ramOnly;
    constructor(path: string, struct: S);
    get<K extends keyof S>(key: K): Optional<S[K]>;
    getStruct(): S;
    write<K extends keyof S>(key: K, content: S[K]): void;
    delete<K extends keyof S>(key: K): void;
    filePath(): string;
    hold(): void;
    writeBack(): void;
}
