import { AudioSource, ImageSource, Optional, ResourceID, Result, Song } from '../../../@types';
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { WatchFile } from './WatchFile';
import { none, some } from '../rust-like-utils-backend/Optional';
import { fail, ok } from '../rust-like-utils-backend/Result';
import { Signal } from '../Signal';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { hash } from '../tungsten/math';
import { SongBuilder } from './SongBuilder';



const bgFileNameRegex = /.*"(?<!Video.*)(.*)".*/;
const beatmapSetIDRegex = /([0-9]+) .*/;

const propertiesMap: Map<string, string> = new Map([
  ['AudioFilename', 'audioSrc'],
  ['BeatmapSetID', 'beatmapSetID'],
  ['Title', 'title'],
  ['TitleUnicode', 'titleUnicode'],
  ['Artist', 'artist'],
  ['ArtistUnicode', 'artistUnicode'],
  ['Creator', 'creator'],
  ['Tags', 'tags'],
  ['Mode', 'mode']
]);



type FileState =
  'Initial'
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

const audioSourceNotFound = 'Audio does not exists.' as const;



export type UpdateSignalType = {
  i: number,
  total: number,
  file: string
};

export type DirParseResult = Promise<Result<[Map<ResourceID, Song>, Map<ResourceID, AudioSource>, Map<ResourceID, ImageSource>], string>>;

export class OsuFileParser {
  private readonly file: string;
  private readonly osuDir: string;
  private audioSourceToken = 'AudioFilename: ';

  private constructor(file: string, osuDir: string) {
    this.file = file;
    this.osuDir = osuDir;
  }

  static new(file: string, osuDir: string): Optional<OsuFileParser> {
    if (!fs.existsSync(file)) {
      return none();
    }

    return some(new OsuFileParser(file, osuDir));
  }

  static async parseSong(osuDir: string, osuFile: string, raw: any): Promise<Result<[Song, AudioSource, ImageSource | undefined], string>> {
    const builder = new SongBuilder();
    const config = WatchFile.new(osuFile);
    if (config.isError) {
      return fail(config.error);
    }

    builder.set("config", config.value);

    if (raw.audioSrc === undefined) {
      return fail(audioSourceNotFound);
    }

    const dir = path.dirname(osuFile);
    builder.set("dir", dir);

    const songPath = path.join(dir, raw.audioSrc);
    if (!fs.existsSync(songPath)) {
      return fail(audioSourceNotFound);
    }

    const audio: AudioSource = {
      id: hash(songPath),
      path: path.relative(osuDir, songPath),
      ctime: fs.lstatSync(songPath)?.ctime.toISOString()
    };

    builder.set("audio", audio.id);
    let bg: ImageSource | undefined = undefined;

    if (raw.bgSrc !== undefined) {
      const imgPath = path.join(dir, raw.bgSrc);
      if (fs.existsSync(imgPath)) {
        bg = {
          id: hash(imgPath),
          path: path.relative(osuDir, imgPath),
          ctime: fs.lstatSync(imgPath)?.ctime.toISOString()
        };

        builder.set("bg", bg.id);
      }
    }

    if (raw.beatmapSetID !== undefined) {
      builder.set("beatmapSetID", Number(raw.beatmapSetID));
    } else {
      const beatmapSetID = beatmapSetIDRegex.exec(path.basename(dir));
      if (beatmapSetID !== null) {
        builder.set("beatmapSetID", Number(beatmapSetID[1]));
      }
    }

    if (typeof raw.tags === 'string') {
      const t: string[] = raw.tags.split(' ');
      for (let i = 0; i < t.length; i++) {
        t[i] = t[i].toLowerCase();
      }
      builder.set("tags", t);
    }

    builder.set("duration", await getAudioDurationInSeconds(songPath))
      .set("id", hash(path.resolve(osuFile)))
      .set("bpm", raw.bpm)
      .set("title", raw.title)
      .set("titleUnicode", raw.titleUnicode)
      .set("artist", raw.artist)
      .set("artistUnicode", raw.artistUnicode)
      .set("creator", raw.creator);

    if (raw.mode !== undefined) {
      builder.set("mode", Number(raw.mode));
    }

    return ok([builder.build(), audio, bg]);
  }

  static async parseDir(dir: string, update?: Signal<UpdateSignalType>): DirParseResult {
    if (!fs.existsSync(dir)) {
      return fail('Directory does not exists.');
    }

    const dirs = fs.readdirSync(dir);
    const audioSources: Set<string> = new Set();
    const songs = new Map<ResourceID, Song>();
    const audio = new Map<ResourceID, AudioSource>();
    const images = new Map<ResourceID, ImageSource>();

    for (let i = 0; i < dirs.length; i++) {
      const subDirPath = path.join(dir, dirs[i]);
      if (!fs.lstatSync(subDirPath).isDirectory()) {
        continue;
      }

      const files = fs.readdirSync(subDirPath);
      for (let j = 0; j < files.length; j++) {
        if (!files[j].endsWith('.osu')) {
          continue;
        }

        if (update !== undefined) {
          update.value = {
            i: i + 1,
            total: dirs.length,
            file: files[j]
          };
        }

        const parser = OsuFileParser.new(path.join(subDirPath, files[j]), dir);
        if (parser.isNone) {
          continue;
        }

        const audioSource = parser.value.getAudioSource();
        if (audioSource.isNone || audioSources.has(audioSource.value)) {
          continue;
        }

        const parsed = await parser.value.parseFile();
        if (parsed.isError) {
          continue;
        }

        songs.set(parsed.value[0].id, parsed.value[0]);
        audio.set(parsed.value[1].id, parsed.value[1]);

        if (parsed.value[2] !== undefined) {
          images.set(parsed.value[2].id, parsed.value[2]);
        }
        audioSources.add(audioSource.value);
      }
    }

    return ok([songs, audio, images]);
  }

  getAudioSource(): Optional<string> {
    const content = fs.readFileSync(this.file, { encoding: 'utf8' });
    const start = content.indexOf(this.audioSourceToken) + this.audioSourceToken.length;

    for (let i = start; i < content.length; i++) {
      if (content[i] === '\n'
        || content[i] === '\r'
        || (content[i] === '\r' && content[i + 1] === '\n')) {
        return some(content.substring(start, i));
      }
    }

    return none();
  }

  async parseFile(): Promise<Result<[Song, AudioSource, (ImageSource | undefined)], string>> {
    const fileLines = readline.createInterface({
      input: fs.createReadStream(this.file),
      crlfDelay: Infinity
    });

    let state: FileState = 'Initial';
    const song: any & { bpm: number[][] } = {};
    song.bpm = [];

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
          song['bgSrc'] = bg[1];
        }

        continue;
      }

      if (state === 'TimingPoints') {
        const timingPoint = trimmed.split(',').map(x => Number(x));

        if (timingPoint.length === 2) {
          song.bpm.push(timingPoint);
          continue;
        }

        if (timingPoint[timingPoint.length - 2] === 0) {
          continue;
        }

        if (song.bpm.length !== 0 && song.bpm[song.bpm.length - 1][BPM] === timingPoint[BPM]) {
          continue;
        }

        song.bpm.push([timingPoint[OFFSET], timingPoint[BPM]]);
      }

      const useSpaceAfterColon = state === 'General';

      const split = trimmed.split(useSpaceAfterColon ? ': ' : ':');
      if (split.length !== 2) {
        continue;
      }

      const property = propertiesMap.get(split[0]);

      if (property === undefined) {
        continue;
      }

      song[property] = split[1];
    }

    return await OsuFileParser.parseSong(this.osuDir, this.file, song);
  }
}
