import { Router } from "../lib/route-pass/Router";
import { Song } from '../../@types';



let queue: Song[];
let index = 0;

Router.respond("queueCurrent", () => {
    return queue[index];
});

Router.respond("queuePrevious", () => {
    if (--index < 0) {
        index = queue.length;
    }
});

Router.respond("queueNext", () => {
    if (++index === queue.length) {
        Queue.rewind();
    }
});



export class Queue {
    static rewind(): void {
        index = 0;
    }

    static load(songs: Song[]): void {
        queue = songs;
    }
}
