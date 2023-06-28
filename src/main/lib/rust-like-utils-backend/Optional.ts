import { Optional } from "../../../@types";



export function none(): Optional<any> {
    return {
        isNone: true
    };
}

export function some<V>(value: V): Optional<V> {
    return {
        value,
        isNone: false
    };
}
