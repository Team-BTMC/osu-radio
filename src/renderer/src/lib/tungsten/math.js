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
const CHARSET = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-_";
export function hash(str, bits = 64) {
    let n = 0n;
    const mask = BigInt("0b" + ("1".repeat(bits)));
    for (let i = 0, len = str.length; i < len; i++) {
        const chr = BigInt(str.charCodeAt(i));
        n = (n << 5n) - n + chr;
        n &= mask; // convert to 64 bits
    }
    let hash = "";
    for (let i = 0; i < Math.ceil(bits / 6); i++) {
        hash += CHARSET[Number(n & 0x3fn)];
        n >>= 6n;
    }
    return hash;
}
