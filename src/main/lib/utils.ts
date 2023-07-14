// import { Song } from '../../@types';
// import path from 'path';
// import fs from 'fs';



// export function checkConfigChanges(songs: { [id: string]: Song }): void {
//   let count = 0;
//   const total = Object.values(songs).length;
//
//   for (const id in songs) {
//     const s = songs[id];
//
//     const configSource = path.join(s.dir, '/' + s.config.fileName);
//     if (!(fs.existsSync(configSource) && fs.lstatSync(configSource).ctime.toISOString() === s.config.ctime)) {
//       count++;
//       process.stdout.write('\r\x1b[KNeed to update: ' + count + '/' + total);
//     }
//   }
// }
