import { Optional, Song } from "../../@types";
import { Dispatcher } from "./Dispatcher.js";
import { none, some } from "./rust-like-utils-client/Optional.js";
import { importAPI } from "./tungsten/api";



const apiOptional = importAPI();
if (apiOptional.isNone) {
    throw new Error("Chief, we've got a problem. No API found to be fuc- I mean... use :D");
}
const api = apiOptional.value;

const player = new Audio();
player.volume = 0.5;



const current: {
    media?: URL,
    song?: Song,
    bpm?: number
} = {};
let isPlaying: boolean = false;



type ZeroToOne = number;



export class Music {
    static readonly events: Dispatcher<{
        "songChange": Song,
        "timeUpdate": {
            current: number,
            duration: number
        },
        "bpmUpdate": number | undefined
    }> = new Dispatcher();



    static async current(): Promise<URL> {
        current.song = await api.request("queueCurrent");
        current.media = new URL(current.song.dir + "\\" + current.song.audio.fileName);
        return current.media;
    }

    static async play(): Promise<void> {
        if (current.media === undefined) {
            await Music.current();
        }

        if (player.src !== current.media.href) {
            player.src = current.media.href;
            this.events.dispatch("songChange", current.song);
        }

        player.volume = 0.5;
        await player.play();
    }

    static pause(): void {
        player.pause();
    }

    static async next(): Promise<void> {
        await api.request("queueNext");
        player.src = (await this.current()).href;

        if (isPlaying === true) {
            await this.play();
        }

        this.events.dispatch("songChange", current.song);
    }

    static async previous(): Promise<void> {
        await api.request("queuePrevious");
        player.src = (await this.current()).href;

        if (isPlaying === true) {
            await this.play();
        }

        this.events.dispatch("songChange", current.song);
    }

    static async togglePlay(force?: boolean): Promise<void> {
        if (arguments.length === 1) {
            isPlaying = force;

            if (force === true) {
                await Music.play();
                return;
            }

            Music.pause();
            return;
        }

        if (isPlaying === true) {
            isPlaying = !isPlaying;
            Music.pause();
            return;
        }

        isPlaying = !isPlaying;
        await Music.play();
    }

    static isPlaying(): boolean {
        return isPlaying;
    }

    static seek(range: ZeroToOne): void {
        player.currentTime = range * player.duration;
        this.events.dispatch("timeUpdate", {
            current: player.currentTime,
            duration: player.duration
        });
    }
}
Music.events.on("songChange", () => {
    current.bpm = undefined;
    Music.events.dispatch("bpmUpdate", undefined);
});



player.addEventListener("ended", async () => {
    await Music.next();
});

const OFFSET = 0;
const BPM = 1;

player.addEventListener("timeupdate", () => {
    Music.events.dispatch("timeUpdate", {
        current: player.currentTime,
        duration: player.duration
    });

    if (current.song.bpm[0][OFFSET] / 1000 > player.currentTime) {
        return;
    }

    const bpm = currentBPM(player.currentTime, current.song.bpm);
    if (!bpm.isNone && bpm.value !== current.bpm) {
        current.bpm = bpm.value;
        Music.events.dispatch("bpmUpdate", bpm.value);
    }
});



function currentBPM(offset: number, changes: number[][]): Optional<number> {
    if (changes.length === 0 || offset < changes[0][OFFSET] / 1000) {
        return none();
    }

    for (let i = 1; i < changes.length; i++) {
        if (changes[0][OFFSET] / 1000 <= offset && offset < changes[i][OFFSET] / 1000) {
            return some(bpm(changes[i - 1][BPM]));
        }
    }

    return some(bpm(changes[changes.length - 1][BPM]));
}



function bpm(ms: number): number {
    if (ms === 0 || 60_000 / ms > 10_000) {
        return Infinity;
    }

    return Math.round(60_000 / ms);
}
