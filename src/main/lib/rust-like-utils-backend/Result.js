export function ok(value) {
    return {
        value,
        isError: false
    };
}
export function fail(error) {
    return {
        error,
        isError: true
    };
}
