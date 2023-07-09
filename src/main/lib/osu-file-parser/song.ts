import { Song, SongIndex } from '../../../@types';



function createSongIndex(id: string, song: Song): SongIndex {
  return {
    id,
    t: (song.beatmapSetID + song.title + (song.titleUnicode ?? '')).toLowerCase(),
    a: (song.artist + (song.artistUnicode ?? '')).toLowerCase(),
    c: song.creator.toLowerCase(),
    d: song.duration,
    m: song.mode,
    tags: song.tags,
    bpm: Math.round(60_000 / (averageBPM(song.bpm, song.duration * 1_000)))
  };
}

export type IndexCallback = (i: number, song: string) => void;
export function collectTagsAndIndexSongs(songs: { [id: string]: Song }, fn?: IndexCallback): [SongIndex[], Map<string, string[]>] {
  const indexes: SongIndex[] = [];
  const tags = new Map<string, string[]>();
  let i = 0;

  for (const id in songs) {
    i++;
    const song = songs[id];

    if (fn !== undefined) {
      fn(i, song.artist + " - " + song.title);
    }

    indexes.push(createSongIndex(id, song));

    if (song.tags === undefined) {
      continue;
    }

    for (let i = 0; i < song.tags.length; i++) {
      const key = song.tags[i].toLowerCase();
      const entry = tags.get(key);

      if (entry === undefined) {
        tags.set(key, [id]);
        continue;
      }

      entry.push(id);
    }
  }

  return [indexes, tags];
}

export function averageBPM(bpm: number[][], durationMS: number): number {
  if (bpm.length === 0) {
    return NaN;
  }

  if (bpm.length === 1) {
    return bpm[0][1];
  }

  const lookup = new Map<number, number[]>();
  let highestEntry = [-Infinity, NaN];

  for (let i = 0; i < bpm.length; i++) {
    const end = i + 1 === bpm.length
      ? durationMS
      : bpm[i + 1][0];

    const entry = lookup.get(bpm[i][1]);
    if (entry === undefined) {
      lookup.set(bpm[i][1], [end - bpm[i][0], bpm[i][1]]);
      continue;
    }

    entry[0] += end - bpm[i][0];

    if (entry[0] > highestEntry[0]) {
      highestEntry = entry;
    }
  }

  return highestEntry[1];
}