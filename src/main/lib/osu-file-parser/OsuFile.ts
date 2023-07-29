import fs from 'graceful-fs';
import { fail, ok } from '../rust-like-utils-backend/Result';
import { AudioSource, ImageSource, Optional, Result, Song } from '../../../@types';
import { none, some } from '../rust-like-utils-backend/Optional';
import { SongBuilder } from '../song/SongBuilder';
import path from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { access, readFile, stat } from '../fs-promises';



type ParsedSong = {
  song: Song,
  audio: AudioSource,
  bg: Optional<ImageSource>
}

export class OsuFile {
  path: string;
  props: Map<string, string>;
  bpm: number[][];
  beatmapSetID: number;

  constructor(path: string, props: Map<string, string>, bpm: number[][], beatmapSetID: number) {
    this.path = path;
    this.bpm = bpm;
    this.props = props;
    this.beatmapSetID = beatmapSetID;
  }

  async toSong(osuDir: string): Promise<Result<ParsedSong, string>> {
    if (!await access(osuDir, fs.constants.R_OK)) {
      return fail("File does not exist.");
    }

    const audioSrc = this.props.get("AudioFilename");
    if (audioSrc === undefined) {
      return fail("AudioFilename is not defined.");
    }

    const builder = new SongBuilder();

    const resourcePath = path.relative(osuDir, this.path);
    builder.set("path", resourcePath);

    builder.set("beatmapSetID", this.beatmapSetID);

    const config = await stat(this.path);
    builder.set("ctime", config.ctime.toISOString());
    builder.set("dateAdded", config.mtime.toISOString());

    const dir = path.dirname(this.path);

    const songPath = path.resolve(path.join(dir, audioSrc));
    if (!await access(songPath, fs.constants.R_OK)) {
      return fail("Audio does not exist.");
    }

    const audioPath = path.relative(osuDir, songPath);
    const audio: AudioSource = {
      songID: resourcePath,
      path: audioPath,
      ctime: (await stat(songPath)).ctime.toISOString()
    };

    builder.set("audio", audio.path);
    let bg = none();

    const bgSrc = this.props.get("bgSrc");
    if (bgSrc !== undefined) {
      const imageSource = path.resolve(path.join(dir, bgSrc));
      if (await access(imageSource, fs.constants.F_OK)) {
        const imagePath = path.relative(osuDir, imageSource);
        bg = some({
          songID: resourcePath,
          path: imagePath,
          ctime: (await stat(imageSource)).ctime.toISOString()
        });

        builder.set("bg", imagePath);
      }
    }

    const tags = this.props.get("Tags");
    if (typeof tags === 'string') {
      builder.set("tags", tags.toLowerCase().split(' '));
    }

    builder.set("duration", await getAudioDurationInSeconds(songPath))
      .set("bpm", this.bpm)
      .set("title", this.props.get("Title") ?? "")
      .set("titleUnicode", this.props.get("TitleUnicode") ?? "")
      .set("artist", this.props.get("Artist") ?? "")
      .set("artistUnicode", this.props.get("ArtistUnicode") ?? "")
      .set("creator", this.props.get("Creator") ?? "");

    const diff = this.props.get("Version");
    builder.set("diffs", diff !== undefined ? [diff.toLowerCase()] : []);

    const mode = this.props.get("Mode");
    if (mode !== undefined) {
      builder.set("mode", Number(mode));
    }

    return ok({
      song: builder.build(),
      audio,
      bg
    });
  }

  static async getProp(file: string, prop: string): Promise<Result<string, string>> {
    if (!await access(file, fs.constants.R_OK)) {
      return fail("File does not exist.");
    }

    const content = await readFile(file);
    const start = content.indexOf(prop) + prop.length;
    let offset = 1;

    const char = content.charCodeAt(start + 1); // looking for space after ":", because some properties are defined as "name: " and others are "name:"
    if (char === 32 || char === 160) { // space (32), non-breaking space (160)
      offset = 2;
    }

    for (let i = start + offset; i < content.length; i++) {
      if (content[i] === '\n'
        || content[i] === '\r'
        || (content[i] === '\r' && content[i + 1] === '\n')) {
        return ok(content.substring(start + offset, i));
      }
    }

    return ok("");
  }
}