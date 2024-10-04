import { Song } from "../../../@types";

/**
 * @returns Time difference between beats in ms
 */
export function averageBPM(bpm: number[][], durationMS: number): number {
  if (bpm.length === 0) {
    return NaN;
  }

  if (bpm.length === 1) {
    return bpm[0][1];
  }

  const lookup = new Map<number, [number, number]>();
  let highestEntry: [number, number] = [-Infinity, NaN];

  for (let i = 0; i < bpm.length; i++) {
    const end = i + 1 === bpm.length ? durationMS : bpm[i + 1][0];

    let entry = lookup.get(bpm[i][1]);

    if (entry === undefined) {
      entry = [end - bpm[i][0], bpm[i][1]];
      lookup.set(bpm[i][1], entry);
    } else {
      entry[0] += end - bpm[i][0];
    }

    if (entry[0] > highestEntry[0]) {
      highestEntry = entry;
    }
  }

  return highestEntry[1];
}

export function msToBPM(ms: number): number {
  if (ms === 0 || 60_000 / ms > 10_000) {
    return Infinity;
  }

  return Math.round(60_000 / ms);
}

export function isSongUndefined(song: Song | undefined): boolean {
  return song === undefined || song.path === "";
}
