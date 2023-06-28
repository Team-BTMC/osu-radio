export function clamp(min: number, max: number, number: number): number {
    if (number < min) return min;
    return number > max ? max : number;
}

export function map(value: number, fromStart: number, fromEnd: number, toStart: number, toEnd: number): number {
    return ((value - fromStart) / (fromEnd - fromStart)) * (toEnd - toStart) + toStart;
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



export function rng(from: number, to: number): number {
    return Math.random() * (Math.max(from, to) - Math.min(from, to)) + from;
}



export function flatRNG(from: number, to: number): number {
    return Math.floor(rng(from, to));
}