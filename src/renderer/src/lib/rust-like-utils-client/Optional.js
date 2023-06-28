export function none() {
    return {
        isNone: true
    };
}
export function some(value) {
    return {
        value,
        isNone: false
    };
}
