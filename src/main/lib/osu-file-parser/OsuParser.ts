import { AudioSource, ImageSource, ResourceID, Result, Song } from '../../../@types';
import readline from 'readline';
import path from 'path';
import { fail, ok } from '../rust-like-utils-backend/Result';
import { OsuFile } from './OsuFile';
import { access, getFiles, getSubDirs } from '../fs-promises';
import fs from 'graceful-fs';
import { clearInterval } from 'timers';
import { hash } from '../tungsten/math';



const bgFileNameRegex = /.*"(?<!Video.*)(.*)".*/;
const beatmapSetIDRegex = /([0-9]+) .*/;



type FileState = 'Initial'
  | 'General'
  | 'Editor'
  | 'Metadata'
  | 'Difficulty'
  | 'Events'
  | 'TimingPoints'
  | 'Colours'
  | 'HitObjects';

const OFFSET = 0;
const BPM = 1;



type Table<T> = Map<ResourceID, T>;

export type DirParseResult = Promise<Result<[Table<Song>, Table<AudioSource>, Table<ImageSource>], string>>

export class OsuParser {
  static async parseDir(dir: string, update?: (i: number, total: number, file: string) => any): DirParseResult {
    if (!await access(dir, fs.constants.R_OK)) {
      return fail('Directory does not exists.');
    }

    let lastAudioID = "";
    let lastAudioSong: any = undefined;

    // const audioSources = new Set<string>();
    const dirs = await getSubDirs(dir);
    const songTable = new Map<ResourceID, Song>();
    const audioTable = new Map<ResourceID, AudioSource>();
    const imageTable = new Map<ResourceID, ImageSource>();

    const stats = {
      audioErr: 0,
      found: 0,
      parseErr: 0,
      toSongErr: 0,
    }

    const errors = {};

    const interval = setInterval(
      () => console.log(stats, errors, "song table:", songTable.size),
      1_000
    );

    for (let i = 0; i < dirs.length; i++) {
      const subDirPath = path.join(dir, dirs[i]);

      const files = await getFiles(subDirPath, "osu");
      for (let j = 0; j < files.length; j++) {
        if (update !== undefined) {
          update(i + 1, dirs.length, files[j]);
        }

        const file = path.join(subDirPath, files[j]);
        const audioSrc = await OsuFile.getProp(file, "AudioFilename");

        if (audioSrc.isError) {
          stats.audioErr++;

          if (errors[audioSrc.error] !== undefined) {
            errors[audioSrc.error]++;
          } else {
            errors[audioSrc.error] = 1;
          }

          continue;
        }

        const audioID = hash(path.join(dirs[i], audioSrc.value));
        let s: Song | undefined = undefined;

        if (audioID === lastAudioID) {
          s = lastAudioSong;
        } else {
          const a = audioTable.get(audioID);

          if (a !== undefined) {
            s = songTable.get(a.songID);
          }

          if (s !== undefined) {
            lastAudioID = audioID;
            lastAudioSong = s;
          }
        }

        if (s !== undefined) {
          const diff = await OsuFile.getProp(file, "Version");

          if (diff.isError) {
            continue;
          }

          stats.found++;
          s.diffs.push(diff.value);
          continue;
        }
        // const audioPath = path.resolve(path.join(subDirPath, audioSrc.value));

        // let audioID: string;
        // if (audioPath === lastAudioPath) {
        //   audioID = lastAudioHash;
        // } else {
        //   audioID = lastAudioHash = hash(audioPath);
        // }
        //

        // const audioID = hash(audioPath);
        // const a = audioTable.get(audioID);
        //
        // if (a !== undefined) {
        //   const parsedSong = songTable.get(a.songID);
        //   if (parsedSong !== undefined) {
        //     const diff = OsuFile.getProp(file, "Version");
        //
        //     if (diff.isError) {
        //       continue;
        //     }
        //
        //     s.diffs.push(diff.value);
        //     continue;
        //   }
        // }

        const parsed = await OsuParser.parseFile(file);
        if (parsed.isError) {
          stats.parseErr++;

          if (errors[parsed.error] !== undefined) {
            errors[parsed.error]++;
          } else {
            errors[parsed.error] = 1;
          }

          continue;
        }

        const result = await parsed.value.toSong(dir);
        if (result.isError) {
          stats.toSongErr++;

          if (errors[result.error] !== undefined) {
            errors[result.error]++;
          } else {
            errors[result.error] = 1;
          }

          continue;
        }

        const { song, audio, bg } = result.value;

        songTable.set(song.id, song);
        audioTable.set(audio.id, audio);

        if (!bg.isNone) {
          imageTable.set(bg.value.id, bg.value);
        }
      }
    }

    clearInterval(interval);
    console.log(stats, errors, "song table:", songTable.size);

    return ok([songTable, audioTable, imageTable]);
  }

  static async parseFile(file: string): Promise<Result<OsuFile, string>> {
    if (!await access(file, fs.constants.R_OK)) {
      return fail("File does not exists.");
    }

    const stream = fs.createReadStream(file);
    const fileLines = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    let state: FileState = 'Initial';
    const props = new Map<string, string>();
    const bpm: number[][] = [];

    for await (const line of fileLines) {
      const trimmed = line.trim();

      if (trimmed === '') {
        continue;
      }

      if (trimmed[0] === '[' && trimmed[trimmed.length - 1] === ']') {
        state = trimmed.substring(1, trimmed.length - 1) as FileState;

        if (state === 'HitObjects') {
          break;
        }

        continue;
      }

      if (state === 'Initial' || state === 'Editor' || state === 'Difficulty' || state === 'Colours') {
        continue;
      }

      if (state === 'Events') {
        const bg = bgFileNameRegex.exec(trimmed);
        if (bg !== null) {
          props.set("bgSrc", bg[1]);
        }

        continue;
      }

      if (state === 'TimingPoints') {
        const timingPoint = trimmed.split(',').map(x => Number(x));

        if (timingPoint.length === 2) {
          bpm.push(timingPoint);
          continue;
        }

        if (timingPoint[timingPoint.length - 2] === 0) {
          continue;
        }

        if (bpm.length !== 0 && bpm[bpm.length - 1][BPM] === timingPoint[BPM]) {
          continue;
        }

        bpm.push([timingPoint[OFFSET], timingPoint[BPM]]);
      }

      const useSpaceAfterColon = state === 'General';

      const split = trimmed.split(useSpaceAfterColon ? ': ' : ':');
      if (split.length !== 2) {
        continue;
      }

      props.set(split[0], split[1]);
    }

    stream.destroy();
    fileLines.close();

    const result = beatmapSetIDRegex.exec(file);
    const beatmapSetID = result !== null
      ? Number(result[1])
      : 0;

    return ok(new OsuFile(file, props, bpm, beatmapSetID));
  }
}
