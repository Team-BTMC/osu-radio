import { Result } from "../../../../@types";
export declare function ok<V>(value: V): Result<V, any>;
export declare function fail<E>(error: E): Result<any, E>;
