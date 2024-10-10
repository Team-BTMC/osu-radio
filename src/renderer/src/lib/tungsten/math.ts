export function clamp(min: number, max: number, number: number): number {
  if (number < min) return min;
  return number > max ? max : number;
}

export function map(
  value: number,
  fromStart: number,
  fromEnd: number,
  toStart: number,
  toEnd: number
): number {
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

const CHARSET = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-_";
export function hash(str: string, bits = 64): string {
  let n = 0n;
  const mask = BigInt("0b" + "1".repeat(bits));

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

export type Vec2 = [number, number];

export function vec2Length(a: Vec2, b: Vec2): number {
  return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
}
