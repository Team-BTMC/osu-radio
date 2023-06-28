import { Result } from "../../../@types";



export function ok<V>(value: V): Result<V, any> {
    return {
        value,
        isError: false
    };
}

export function fail<E>(error: E): Result<any, E> {
    return {
        error,
        isError: true
    };
}
