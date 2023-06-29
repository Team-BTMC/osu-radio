import { Storage } from './lib/storage/Storage';
import { Router } from './lib/route-pass/Router';
import "./router/dir-router";
import { dirSubmit } from './router/dir-router';
import { OsuFileParser } from './lib/osu-file-parser/OsuFileParser';
import { Signal } from './lib/Signal';
import { showError } from './router/error-router';
import { collectTagsAndIndexSongs } from './lib/osu-file-parser/song';
export async function main(window) {
    const settings = Storage.getTable("settings");
    if (settings.get("osuSongsDir").isNone) {
        let songsMap;
        do {
            await Router.dispatch(window, "changeScene", "dir-select");
            const dir = await dirSubmit();
            await Router.dispatch(window, "changeScene", "loading");
            await Router.dispatch(window, "loadingSetTitle", "Importing songs from osu! Songs directory");
            const s = new Signal();
            let updateTimer = undefined;
            s.listen(update => {
                if (updateTimer !== undefined) {
                    return;
                }
                updateTimer = setTimeout(async () => {
                    await Router.dispatch(window, "loadingUpdate", {
                        current: update.i,
                        hint: update.file,
                        max: update.total
                    });
                    updateTimer = undefined;
                }, 100);
            });
            songsMap = await OsuFileParser.parseDir(dir, s);
            clearTimeout(updateTimer);
            if (songsMap.isError === true) {
                await showError(window, songsMap.error);
                continue;
            }
            settings.write("osuSongsDir", dir);
            break;
        } while (true);
        await Router.dispatch(window, "loadingUpdate", {
            max: songsMap.value.size,
            current: songsMap.value.size,
            hint: `Imported total of ${songsMap.value.size} songs`
        });
        const primitive = Object.fromEntries(songsMap.value);
        Storage.setTable("songs", primitive);
        const total = Object.values(primitive).length;
        let updateTimer = undefined;
        await Router.dispatch(window, "loadingSetTitle", "Indexing songs");
        const [indexes, tags] = collectTagsAndIndexSongs(primitive, (i, song) => {
            if (updateTimer !== undefined) {
                return;
            }
            updateTimer = setTimeout(async () => {
                await Router.dispatch(window, "loadingUpdate", {
                    current: i,
                    hint: song,
                    max: total
                });
                updateTimer = undefined;
            }, 10);
        });
        clearTimeout(updateTimer);
        const system = Storage.getTable("system");
        system.hold();
        system.write("indexes", indexes);
        system.write("allTags", Object.fromEntries(tags));
        system.writeBack();
        await Router.dispatch(window, "loadingUpdate", {
            current: total,
            hint: "Indexed " + total + " songs",
            max: total
        });
    }
}
