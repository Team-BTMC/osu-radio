import { Storage } from './lib/storage/Storage';
import { Router } from './lib/route-pass/Router';
import "./router/dir-router";
export async function main(window) {
    if (Storage.getTable("settings").get("osuSongsDir").isNone) {
        await Router.dispatch(window, "changeScene", "dir-select");
    }
}
