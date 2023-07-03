import { BrowserWindow } from 'electron';
import { Storage } from './lib/storage/Storage';
import { Router } from './lib/route-pass/Router';
import { showError } from './router/error-router';
import { dirSubmit } from './router/dir-router';
import "./router/infinite-scroller-router";
import "./router/resource-router";
import { DirParseResult, OsuFileParser, UpdateSignalType } from './lib/osu-file-parser/OsuFileParser';
import { Signal } from './lib/Signal';
import { collectTagsAndIndexSongs } from './lib/osu-file-parser/song';
import Global from './lib/Global';
import { orDefault } from './lib/rust-like-utils-backend/Optional';



export async function main(window: BrowserWindow) {
  const settings = Storage.getTable("settings");
  // settings.delete("osuSongsDir");

  if (settings.get("osuSongsDir").isNone) {
    await configureOsuDir(window);
  } else {
    //todo check for updates in song files
  }

  const songsArray = Object.values(Storage.getTable("songs").getStruct());
  if (songsArray.length === 0) {
    await showError(window, `No songs found in folder: ${orDefault(settings.get("osuSongsDir"), "[No folder]")}. Please make sure this is the directory where you have all your songs saved.`);
    await configureOsuDir(window);
  }

  Global.cache.set("songs", songsArray.sort((a, b) => (a.artist + a.title).localeCompare(b.artist + b.title)));

  await Router.dispatch(window, "changeScene", "main");
}



async function configureOsuDir(mainWindow: BrowserWindow) {
  let maps: Awaited<DirParseResult>;
  const settings = Storage.getTable("settings");

  do {
    await Router.dispatch(mainWindow, "changeScene", "dir-select");
    const dir = await dirSubmit();

    await Router.dispatch(mainWindow, "changeScene", "loading");
    await Router.dispatch(mainWindow, "loadingSetTitle", "Importing songs from osu! Songs directory");

    const s = new Signal<UpdateSignalType>();
    let updateTimer: NodeJS.Timeout | undefined = undefined;
    s.listen(update => {
      if (updateTimer !== undefined) {
        return;
      }

      updateTimer = setTimeout(async () => {
        await Router.dispatch(mainWindow, "loadingUpdate", {
          current: update.i,
          hint: update.file,
          max: update.total
        });

        updateTimer = undefined;
      }, 100);
    });

    maps = await OsuFileParser.parseDir(dir, s);
    clearTimeout(updateTimer);

    if (maps.isError === true) {
      await showError(mainWindow, maps.error);
      continue;
    }

    if (maps.value[0].size === 0) {
      await showError(mainWindow, `No songs found in folder: ${orDefault(settings.get("osuSongsDir"), "[No folder]")}. Please make sure this is the directory where you have all your songs saved.`);
      continue;
    }

    settings.write("osuSongsDir", dir);
    break;
  } while(true);

  await Router.dispatch(mainWindow, "loadingUpdate", {
    max: maps.value[0].size,
    current: maps.value[0].size,
    hint: `Imported total of ${maps.value[0].size} songs`
  });

  const primitive = Object.fromEntries(maps.value[0]);
  Storage.setTable("songs", primitive);
  Storage.setTable("audio", Object.fromEntries(maps.value[1]));
  Storage.setTable("images", Object.fromEntries(maps.value[2]));

  const total = Object.values(primitive).length;
  let updateTimer: NodeJS.Timeout | undefined = undefined;
  await Router.dispatch(mainWindow, "loadingSetTitle", "Indexing songs");
  const [indexes, tags] = collectTagsAndIndexSongs(primitive, (i, song) => {
    if (updateTimer !== undefined) {
      return;
    }

    updateTimer = setTimeout(async () => {
      await Router.dispatch(mainWindow, "loadingUpdate", {
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

  await Router.dispatch(mainWindow, "loadingUpdate", {
    current: total,
    hint: "Indexed " + total + " songs",
    max: total
  });
}