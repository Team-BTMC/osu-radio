import { Song, SongIndex } from '../../@types';
import path from "path";
import fs from "fs";

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

export function filterTags(tags: string[], includes: string[], excludes: string[]): boolean {
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

export function indexSongs(songs: { [id: string]: Song }): [SongIndex[], Map<string, string[]>] {
    const indexes: SongIndex[] = [];
    const tags = new Map<string, string[]>();

    for (const id in songs) {
        const s = songs[id];
        indexes.push({
            id,
            t: s.beatmapSetID + s.title + (s.titleUnicode ?? ""),
            a: s.artist + (s.artistUnicode ?? ""),
            c: s.creator,
            tags: s.tags,
            bpm: averageBPM(s.bpm, s.duration * 1_000)
        });

        for (let i = 0; i < s.tags.length; i++) {
            const entry = tags.get(s.tags[i]);
            if (entry === undefined) {
                tags.set(s.tags[i], [id]);
                continue;
            }

            entry.push(id);
        }
    }

    return [indexes, tags];
}

export function checkConfigChanges(songs: { [id: string]: Song }): void {
    let count = 0;
    const total = Object.values(songs).length;

    for (const id in songs) {
        const s = songs[id];

        const configSource = path.join(s.dir, "/" + s.config.fileName);
        if (!(fs.existsSync(configSource) && fs.lstatSync(configSource).ctime.toISOString() === s.config.ctime)) {
            count++;
            process.stdout.write("\r\x1b[KNeed to update: " + count + "/" + total);
        }
    }
}
