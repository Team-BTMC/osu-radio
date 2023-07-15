import { BrowserWindow } from 'electron';
import { Storage } from './lib/storage/Storage';
import { Router } from './lib/route-pass/Router';
import { showError } from './router/error-router';
import { dirSubmit } from './router/dir-router';
import "./router/import";
import { DirParseResult, OsuParser } from './lib/osu-file-parser/OsuParser';
import Global from './lib/Global';
import { orDefault } from './lib/rust-like-utils-backend/Optional';
import { throttle } from './lib/throttle';
import { collectTagsAndIndexSongs } from './lib/song';



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



const SONGS = 0;
const AUDIO = 1;
const IMAGES = 2;

async function configureOsuDir(mainWindow: BrowserWindow) {
  let tables: Awaited<DirParseResult>;
  const settings = Storage.getTable("settings");

  do {
    await Router.dispatch(mainWindow, "changeScene", "dir-select");
    const dir = await dirSubmit();

    await Router.dispatch(mainWindow, "changeScene", "loading");
    await Router.dispatch(mainWindow, "loadingSetTitle", "Importing songs from osu! Songs directory");

    const [update, cancelUpdate] = throttle(async (i: number, total: number, file: string) => {
      await Router.dispatch(mainWindow, "loadingUpdate", {
        current: i,
        max: total,
        hint: file,
      });
    }, 25);

    tables = await OsuParser.parseDir(dir, update);
    cancelUpdate();

    if (tables.isError) {
      await showError(mainWindow, tables.error);
      continue;
    }

    if (tables.value[SONGS].size === 0) {
      await showError(mainWindow, `No songs found in folder: ${orDefault(settings.get("osuSongsDir"), "[No folder]")}. Please make sure this is the directory where you have all your songs saved.`);
      continue;
    }

    settings.write("osuSongsDir", dir);
    break;
  } while(true);

  await Router.dispatch(mainWindow, "loadingUpdate", {
    max: tables.value[SONGS].size,
    current: tables.value[SONGS].size,
    hint: `Imported total of ${tables.value[SONGS].size} songs`
  });

  const songs = Object.fromEntries(tables.value[SONGS]);
  Storage.setTable("songs", songs);
  Storage.setTable("audio", Object.fromEntries(tables.value[AUDIO]));
  Storage.setTable("images", Object.fromEntries(tables.value[IMAGES]));

  const total = Object.values(songs).length;
  await Router.dispatch(mainWindow, "loadingSetTitle", "Indexing songs");

  const [update, cancelUpdate] = throttle(async (i: number, song: string) => {
    await Router.dispatch(mainWindow, "loadingUpdate", {
      current: i,
      hint: song,
      max: total
    });
  }, 25);

  const [indexes, tags] = collectTagsAndIndexSongs(songs, update);
  cancelUpdate();

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