import { AudioSource, ImageSource, ResourceID, Result, Song } from "../../../@types";
import { access } from "../fs-promises";
import { fail, ok } from "../rust-like-utils-backend/Result";
import { assertNever } from "../tungsten/assertNever";
import { OsuFile } from "./OsuFile";
import fs from "graceful-fs";
import os from "os";
import path from "path/posix";
import readline from "readline";

const bgFileNameRegex = /.*"(?<!Video.*)(.*)".*/;
const beatmapSetIDRegex = /([0-9]+) .*/;

type FileState =
  | "Initial"
  | "NextState"
  | "General"
  | "Editor"
  | "Metadata"
  | "Difficulty"
  | "Events"
  | "TimingPoints"
  | "Colours"
  | "HitObjects";

const OFFSET = 0;
const BPM = 1;

type Table<T> = Map<ResourceID, T>;

export type DirParseResult = Promise<
  Result<[Table<Song>, Table<AudioSource>, Table<ImageSource>], string>
>;

// Overriding Buffer prototype because I'm lazy.
// Should probably get moved to another file, or make a wrapper instead.

class BufferReader {
  buffer: Buffer;
  pos: number;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.pos = 0;
  }

  readBytes(n: number) {
    const out = this.buffer.slice(this.pos, this.pos + n);
    this.pos += n;
    return out;
  }

  readString() {
    const emptyCheck = this.readByte();
    if (emptyCheck === 0) return "";

    const len = this.readUleb128();
    return this.readBytes(len).toString("utf-8");
  }

  readHash() {
    const emptyCheck = this.readByte();
    if (emptyCheck === 0) return "00000000000000000000000000000000";

    let len = this.readUleb128();
    if (len > 32) len = 32;

    return this.readBytes(len).toString("utf-8");
  }

  readUleb128() {
    let result = 0;
    let shift = 0;
    let byte = 0;

    do {
      byte = this.readByte();
      result |= (byte & 0x7f) << shift;
      shift += 7;
    } while (byte & 0x80);

    return result;
  }

  readDouble() {
    const bytes = this.readBytes(8);
    return bytes.readDoubleLE(0);
  }

  readFloat() {
    const bytes = this.readBytes(4);
    return bytes.readFloatLE(0);
  }

  readLong() {
    const low = this.readInt();
    const high = this.readInt();
    return (high << 32) | low;
  }

  readInt() {
    const bytes = this.readBytes(4);
    return bytes.readUInt32LE(0);
  }

  readShort() {
    const bytes = this.readBytes(2);
    return bytes.readUInt16LE(0);
  }

  readByte() {
    return this.readBytes(1)[0] & 0xff;
  }
}

export class OsuParser {
  static async parseDatabase(
    databasePath: string,
    update?: (i: number, total: number, file: string) => any,
  ): DirParseResult {
    let dbBuffer;
    // NOTE: databasePath is not double slashed
    // on windows this will cause uninteded behavior with 'path/posix'
    // due to the path seperators attempting to escape the string

    // Handles any subdirectory of the 'osu!' folder when choosing a directory
    let currentDir = databasePath;
    // Solution to the issue mentioned in the note above
    currentDir = databasePath.replaceAll("\\", "/");

    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, "osu!.db"))) {
        databasePath = currentDir;
        break;
      }
      currentDir = path.dirname(currentDir);
    }

    let songsFolderPath = databasePath + "/Songs";

    try {
      // NOTE: This isn't readFile from fs-promises.ts.
      //       We want to read binary data here, not utf-8 encoded data!
      dbBuffer = await fs.promises.readFile(databasePath + "/osu!.db");
    } catch (err) {
      console.error(err);
      return fail("Failed to read osu!.db.");
    }

    const db = new BufferReader(dbBuffer); // Use BufferReader here

    // Scan for cfg file to check for a custom songs folder path
    try {
      const username = os.userInfo().username;
      const cfgFile = await fs.promises.readFile(`${databasePath}/osu!.${username}.cfg`, "utf-8");
      const lines = cfgFile.split("\n");

      for (const line of lines) {
        if (line.includes("BeatmapDirectory")) {
          const customPath = line.split("=")[1].trim();
          if (customPath !== "Songs") {
            songsFolderPath = customPath;
            console.log(`Custom songs folder path found: ${songsFolderPath}`);
          }
        }
      }
    } catch (err) {
      console.error(`Either no cfg file was found or there was an error reading it: ${err}`);
    }

    const songTable = new Map<ResourceID, Song>();
    const audioTable = new Map<ResourceID, AudioSource>();

    // NOTE: Images can only be fetched from the .osu file AFAIK.
    //       You should parse those dynamically when needed.
    const imageTable = new Map<ResourceID, ImageSource>();

    const db_version = db.readInt();
    if (db_version < 20170222) {
      return fail("osu!.db is too old, please update the game.");
    }

    db.readInt(); // folder count
    db.readByte();
    db.readLong(); // timestamp

    db.readString().trim(); // player name

    const nb_beatmaps = db.readInt();

    let last_audio_filepath = "";
    for (let i = 0; i < nb_beatmaps; i++) {
      try {
        if (db_version < 20191107) {
          // https://osu.ppy.sh/home/changelog/stable40/20191107.2
          db.readInt();
        }

        const song: Song = {
          audio: "",
          osuFile: "",
          path: "",
          ctime: "",
          dateAdded: "",
          title: "",
          artist: "",
          creator: "",
          bpm: [],
          duration: 0,
          diffs: [],
        };

        song.artist = db.readString().trim();
        song.artistUnicode = db.readString().trim();
        song.title = db.readString().trim();
        song.titleUnicode = db.readString().trim();
        song.creator = db.readString().trim();

        const diff_name = db.readString();
        song.diffs = [diff_name];

        const audio_filename = db.readString();

        db.readHash(); // .osu file md5
        const osu_filename = db.readString().trim();
        db.readByte(); // ranking status
        db.readShort(); // nb circles
        db.readShort(); // nb sliders
        db.readShort(); // nb spinners

        const last_modification_time = db.readLong();
        song.dateAdded = new Date(last_modification_time).toISOString();

        db.readFloat(); // AR
        db.readFloat(); // CS
        db.readFloat(); // HP
        db.readFloat(); // OD
        db.readDouble(); // slider multiplier

        // std
        let nb_star_ratings = db.readInt();
        db.pos += nb_star_ratings * (1 + 4 + 1 + 8); // skipping star ratings

        // taiko
        nb_star_ratings = db.readInt();
        db.pos += nb_star_ratings * (1 + 4 + 1 + 8); // skipping star ratings

        // ctb
        nb_star_ratings = db.readInt();
        db.pos += nb_star_ratings * (1 + 4 + 1 + 8); // skipping star ratings

        // mania
        nb_star_ratings = db.readInt();
        db.pos += nb_star_ratings * (1 + 4 + 1 + 8); // skipping star ratings

        db.readInt(); // drain time
        song.duration = db.readInt() / 1000.0;
        db.readInt(); // preview time

        const nb_timing_points = db.readInt();
        song.bpm = [];
        for (let t = 0; t < nb_timing_points; t++) {
          const bpm = db.readDouble();
          const offset = db.readDouble();
          db.readByte(); // timing change

          if (bpm > 0) {
            song.bpm.push([offset, bpm]);
          }
        }

        db.readInt(); // beatmap id (actually i32)
        song.beatmapSetID = db.readInt(); // beatmapset id (actually i32)
        db.readInt();

        db.readByte(); // std grade
        db.readByte(); // taiko grade
        db.readByte(); // ctb grade
        db.readByte(); // mania grade

        db.readShort(); // local offset
        db.readFloat(); // stack leniency
        song.mode = db.readByte();

        db.readString(); // song source
        song.tags = db.readString().split(" ");

        db.readShort(); // online offset
        db.readString(); // song title font
        db.readByte(); // unplayed
        db.readLong(); // last time played
        db.readByte(); // osz2

        const folder = db.readString().trim();
        db.readLong(); // last online check
        db.readByte(); // ignore beatmap sounds
        db.readByte(); // ignore beatmap skin
        db.readByte(); // disable storyboard
        db.readByte(); // disable video
        db.readByte(); // visual override
        db.readInt(); // last edit time
        db.readByte(); // mania scroll speed

        const audioFilePath = songsFolderPath + "/" + folder + "/" + audio_filename;
        const osuFilePath = songsFolderPath + "/" + folder + "/" + osu_filename;
        song.osuFile = osuFilePath;
        song.audio = audioFilePath;
        song.path = songsFolderPath + "/" + folder;

        // Check if the song has already been processed, and add the diff name to the existing song if so
        const existingSong = songTable.get(audioFilePath);
        if (existingSong) {
          existingSong.diffs.push(song.diffs[0]);
          continue;
        }

        // Read .osu to get bg source
        const osuFile = await this.parseFile(osuFilePath);
        if (osuFile.isError) {
          throw osuFile.error;
        }

        const bgSrc = osuFile.value.props.get("bgSrc");
        song.bg = songsFolderPath + "/" + folder + "/" + bgSrc;

        if (song.audio != last_audio_filepath) {
          songTable.set(song.audio, song);
          audioTable.set(song.audio, {
            songID: song.audio,
            path: song.audio,
            ctime: String(last_modification_time),
          });
        }

        last_audio_filepath = audioFilePath;

        if (update) {
          update(i + 1, nb_beatmaps, song.title);
        }
      } catch (err) {
        console.error(`There was an error processing a beatmap: ${err}`);
      }
    }

    return ok([songTable, audioTable, imageTable]);
  }

  static async parseFile(file: string): Promise<Result<OsuFile, string>> {
    if (!(await access(file, fs.constants.R_OK))) {
      return fail("File does not exists.");
    }

    const stream = fs.createReadStream(file);
    const fileLines = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let state: FileState = "Initial";
    const props = new Map<string, string>();
    const bpm: number[][] = [];

    lines: for await (const line of fileLines) {
      const trimmed = line.trim();

      if (trimmed === "") {
        continue;
      }

      if (trimmed[0] === "[" && trimmed[trimmed.length - 1] === "]") {
        state = trimmed.substring(1, trimmed.length - 1) as FileState;
        continue;
      }

      switch (state) {
        case "HitObjects":
          break lines;

        case "NextState":
        case "Editor":
        case "Difficulty":
        case "Colours":
        case "Initial":
          continue;

        case "Events": {
          const bg = bgFileNameRegex.exec(trimmed);
          if (bg !== null) {
            props.set("bgSrc", bg[1]);
            state = "NextState";
          }

          break;
        }

        case "TimingPoints": {
          const timingPoint = trimmed.split(",").map((x) => Number(x));

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
          break;
        }

        case "General":
        case "Metadata": {
          const [prop, value] = this.#splitProp(trimmed);
          if (prop === undefined) {
            continue;
          }

          props.set(prop, value ?? "");
          break;
        }

        default:
          assertNever(state);
      }
    }

    stream.destroy();
    fileLines.close();

    const result = beatmapSetIDRegex.exec(file);
    const beatmapSetID = result !== null ? Number(result[1]) : 0;

    return ok(new OsuFile(file, props, bpm, beatmapSetID));
  }

  static #splitProp(str: string): [] | [string, string] {
    const colonPos = str.indexOf(":");

    if (colonPos === -1) {
      return [];
    }

    const doSkipSpace = str.charCodeAt(colonPos + 1) === 160 || str.charCodeAt(colonPos + 1) === 32;
    return [str.substring(0, colonPos), str.substring(colonPos + 1 + Number(doSkipSpace))];
  }
}
