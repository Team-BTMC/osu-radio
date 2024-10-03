import fs from "graceful-fs";
import os from "os";
import readline from "readline";
import { AudioSource, ImageSource, ResourceID, Result, Song } from "../../../@types";
import { access } from "../fs-promises";
import { fail, ok } from "../rust-like-utils-backend/Result";
import { assertNever } from "../tungsten/assertNever";
import { OsuFile } from "./OsuFile";

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

Buffer.prototype.read_bytes = function (n) {
  const out = this.slice(this.pos, this.pos + n);
  this.pos += n;
  return out;
};

Buffer.prototype.read_string = function () {
  const empty_check = this.read_u8();
  if (empty_check == 0) return "";

  const len = this.read_uleb128();
  return this.read_bytes(len).toString("utf-8");
};

Buffer.prototype.read_hash = function () {
  const empty_check = this.read_u8();
  if (empty_check == 0) return "00000000000000000000000000000000";

  let len = this.read_uleb128();
  if (len > 32) len = 32;

  return this.read_bytes(len).toString("utf-8");
};

Buffer.prototype.read_uleb128 = function () {
  let result = 0;
  let shift = 0;
  let byte = 0;

  do {
    byte = this.read_u8();
    result |= (byte & 0x7f) << shift;
    shift += 7;
  } while (byte & 0x80);

  return result;
};

Buffer.prototype.read_f64 = function () {
  const bytes = this.read_bytes(8);
  return bytes.readDoubleLE(0);
};

Buffer.prototype.read_f32 = function () {
  const bytes = this.read_bytes(4);
  return bytes.readFloatLE(0);
};

Buffer.prototype.read_u64 = function () {
  const low = this.read_u32();
  const high = this.read_u32();
  return (high << 32) | low;
};

Buffer.prototype.read_u32 = function () {
  const bytes = this.read_bytes(4);
  return bytes.readUInt32LE(0);
};

Buffer.prototype.read_u16 = function () {
  const bytes = this.read_bytes(2);
  return bytes.readUInt16LE(0);
};

Buffer.prototype.read_u8 = function () {
  return this.read_bytes(1)[0] & 0xff;
};

export class OsuParser {
  static async parseDb(
    dbpath: string,
    update?: (i: number, total: number, file: string) => any
  ): DirParseResult {
    let db;
    let songsFolderPath = dbpath + "/Songs";

    try {
      // NOTE: This isn't readFile from fs-promises.ts.
      //       We want to read binary data here, not utf-8 encoded data!
      db = await fs.promises.readFile(dbpath + "/osu!.db");
    } catch (err) {
      return fail("Failed to read osu!.db.");
    }

    // Scan for cfg file to check for a custom songs folder path
    try {
      const username = os.userInfo().username;
      const cfgFile = await fs.promises.readFile(`${dbpath}/osu!.${username}.cfg`, "utf-8");
      const lines = cfgFile.split("\n");
      console.log("cfg file found");

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

    // HACK: Used by prototype overrides above
    db.pos = 0;

    const db_version = db.read_u32();
    console.debug("db version:", db_version);
    if (db_version < 20170222) {
      return fail("osu!.db is too old, please update the game.");
    }

    db.read_u32(); // folder count
    db.read_u8();
    db.read_u64(); // timestamp

    const player_name = db.read_string().trim();
    console.debug("player name:", player_name);

    const nb_beatmaps = db.read_u32();
    console.debug("nb beatmaps:", nb_beatmaps);

    let last_audio_filepath = "";
    for (let i = 0; i < nb_beatmaps; i++) {
      if (db_version < 20191107) {
        // https://osu.ppy.sh/home/changelog/stable40/20191107.2
        db.read_u32();
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
        diffs: []
      };

      song.artist = db.read_string().trim();
      song.artistUnicode = db.read_string().trim();
      song.title = db.read_string().trim();
      song.titleUnicode = db.read_string().trim();
      song.creator = db.read_string().trim();

      // NOTE: I'm being lazy here, and only loading the first diff for a given audio file.
      //       This is wrong, especially if diffs of a set aren't right next to each other in the db.
      const diff_name = db.read_string();
      song.diffs = [diff_name];

      const audio_filename = db.read_string();

      db.read_hash(); // .osu file md5
      const osu_filename = db.read_string().trim();
      db.read_u8(); // ranking status
      db.read_u16(); // nb circles
      db.read_u16(); // nb sliders
      db.read_u16(); // nb spinners

      // TODO: This probably is incorrect. See alternatives:
      // tms_a = (tms - 621355968000000000) / 10000000
      // tms_b = (tms - 504911232000000000)
      const last_modification_time = db.read_u64();
      song.dateAdded = new Date(last_modification_time).toISOString();

      db.read_f32(); // AR
      db.read_f32(); // CS
      db.read_f32(); // HP
      db.read_f32(); // OD
      db.read_f64(); // slider multiplier

      // std
      let nb_star_ratings = db.read_u32();
      for (let s = 0; s < nb_star_ratings; s++) {
        db.read_u8();
        db.read_u32(); // mod flags
        db.read_u8();
        db.read_f64(); // star rating
      }

      // taiko
      nb_star_ratings = db.read_u32();
      for (let s = 0; s < nb_star_ratings; s++) {
        db.read_u8();
        db.read_u32(); // mod flags
        db.read_u8();
        db.read_f64(); // star rating
      }

      // ctb
      nb_star_ratings = db.read_u32();
      for (let s = 0; s < nb_star_ratings; s++) {
        db.read_u8();
        db.read_u32(); // mod flags
        db.read_u8();
        db.read_f64(); // star rating
      }

      // mania
      nb_star_ratings = db.read_u32();
      for (let s = 0; s < nb_star_ratings; s++) {
        db.read_u8();
        db.read_u32(); // mod flags
        db.read_u8();
        db.read_f64(); // star rating
      }

      db.read_u32(); // drain time
      song.duration = db.read_u32() / 1000.0;
      db.read_u32(); // preview time

      const nb_timing_points = db.read_u32();
      song.bpm = [];
      for (let t = 0; t < nb_timing_points; t++) {
        const ms_per_beat = db.read_f64();
        const offset = db.read_f64();
        const timing_change = !!db.read_u8();

        if (ms_per_beat > 0) {
          const bpm = Math.min(60000.0 / ms_per_beat, 9001.0);
          song.bpm.push([offset, bpm]);
        }
      }

      db.read_u32(); // beatmap id (actually i32)
      song.beatmapSetID = db.read_u32(); // beatmapset id (actually i32)
      db.read_u32();

      db.read_u8(); // std grade
      db.read_u8(); // taiko grade
      db.read_u8(); // ctb grade
      db.read_u8(); // mania grade

      db.read_u16(); // local offset
      db.read_f32(); // stack leniency
      song.mode = db.read_u8();

      db.read_string(); // song source
      song.tags = db.read_string();

      db.read_u16(); // online offset
      db.read_string(); // song title font
      db.read_u8(); // unplayed
      db.read_u64(); // last time played
      db.read_u8(); // osz2

      const folder = db.read_string().trim();
      db.read_u64(); // last online check
      db.read_u8(); // ignore beatmap sounds
      db.read_u8(); // ignore beatmap skin
      db.read_u8(); // disable storyboard
      db.read_u8(); // disable video
      db.read_u8(); // visual override
      db.read_u32(); // last edit time
      db.read_u8(); // mania scroll speed

      song.osuFile = songsFolderPath + "/" + folder + "/" + osu_filename;
      const audioFilePath = songsFolderPath + "/" + folder + "/" + audio_filename;
      song.audio = audioFilePath;

      song.path = songsFolderPath + "/" + folder;

      if (song.audio != last_audio_filepath) {
        songTable.set(song.audio, song);
        audioTable.set(song.audio, {
          songID: song.audio,
          path: song.audio,
          ctime: last_modification_time
        });
      }

      last_audio_filepath = audioFilePath;

      if (update) {
        update(i + 1, nb_beatmaps, song.title);
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
      crlfDelay: Infinity
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
