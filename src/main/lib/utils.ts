import { Song } from '../../@types';
import path from 'path';
import fs from 'fs';



export function tagsFilter(tags: string[], includes: string[], excludes: string[]): boolean {
  if (tags.length === 0 || includes.length === 0 && excludes.length === 0) {
    return true;
  }

  let init = 0;
  for (let i = 0; i < tags.length; i++) {
    if (includes.includes(tags[i])) {
      init++;
      continue;
    }

    if (excludes.includes(tags[i])) {
      return false;
    }
  }

  return init === includes.length;
}

export function checkConfigChanges(songs: { [id: string]: Song }): void {
  let count = 0;
  const total = Object.values(songs).length;

  for (const id in songs) {
    const s = songs[id];

    const configSource = path.join(s.dir, '/' + s.config.fileName);
    if (!(fs.existsSync(configSource) && fs.lstatSync(configSource).ctime.toISOString() === s.config.ctime)) {
      count++;
      process.stdout.write('\r\x1b[KNeed to update: ' + count + '/' + total);
    }
  }
}
