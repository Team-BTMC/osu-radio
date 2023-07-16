import { Song, SongIndex } from '../../../@types';
import { averageBPM, msToBPM } from './average-bpm';



function createSongIndex(id: string, song: Song): SongIndex {
  return {
    id,
    t: (song.beatmapSetID + song.title + (song.titleUnicode ?? '')).toLowerCase(),
    a: (song.artist + (song.artistUnicode ?? '')).toLowerCase(),
    c: song.creator.toLowerCase(),
    d: song.duration,
    m: song.mode,
    tags: song.tags,
    diffs: song.diffs,
    bpm: msToBPM(averageBPM(song.bpm, song.duration * 1_000))
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