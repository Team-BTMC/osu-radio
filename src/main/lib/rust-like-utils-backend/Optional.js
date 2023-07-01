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
export function orDefault(opt, def) {
    if (opt.isNone) {
        return def;
    }
    return opt.value;
}
