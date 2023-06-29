export function clamp(min, max, number) {
    if (number < min)
        return min;
    return number > max ? max : number;
}
export function map(value, fromStart, fromEnd, toStart, toEnd) {
    return ((value - fromStart) / (fromEnd - fromStart)) * (toEnd - toStart) + toStart;
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function rng(from, to) {
    return Math.random() * (Math.max(from, to) - Math.min(from, to)) + from;
}
export function flatRNG(from, to) {
    return Math.floor(rng(from, to));
}
const CHARSET = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-_";
export function hash(str) {
    let n = 0n;
    for (let i = 0, len = str.length; i < len; i++) {
        const chr = BigInt(str.charCodeAt(i));
        n = (n << 5n) - n + chr;
        n &= 0xffffffffffffffffn; // convert to 64 bits
    }
    let hash = "";
    for (let i = 0; i < Math.ceil(64 / 6); i++) {
        hash += CHARSET[Number(n & 0x3fn)];
        n >>= 6n;
    }
    return hash;
}
