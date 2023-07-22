import { flatRNG } from './math';



export function shuffle<T>(array: T[]): void {
  for (let i = 0; i < array.length; i++) {
    const j = flatRNG(0, array.length);

    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
}