import { DirParseResult, OsuParser } from "@main/lib/osu-file-parser/OsuParser";
import { Router } from "@main/lib/route-pass/Router";
import { collectTagsAndIndexSongs } from "@main/lib/song";
import { Storage } from "@main/lib/storage/Storage";
import { throttle } from "@main/lib/throttle";
import { dirSubmit } from "@main/router/dir-router";
import { showError } from "@main/router/error-router";
import "@main/router/import";
import { orDefault } from "@shared/lib/rust-types/Optional";
import { BrowserWindow } from "electron";

export let mainWindow: BrowserWindow;

export async function main(window: BrowserWindow) {
  mainWindow = window;

  const settings = Storage.getTable("settings");

  // Deleting osuSongsDir will force initial beatmap import
  // settings.delete("osuSongsDir");
  const osuSongsDir = settings.get("osuSongsDir");

  if (osuSongsDir.isNone) {
    await configureOsuDir(window);
  } else {
    //TODO: check for updates in song files
  }

  const songsArray = Object.values(Storage.getTable("songs").getStruct());
  if (songsArray.length === 0) {
    await showError(
      window,
      `No songs found in folder: ${orDefault(
        settings.get("osuSongsDir"),
        "[No folder]",
      )}. Please make sure this is the directory where you have all your songs saved.`,
    );
    await configureOsuDir(window);
  }

  await Router.dispatch(window, "changeScene", "main");
}

const SONGS = 0;
const AUDIO = 1;
const IMAGES = 2;

// Update client progress bar 50 times a second
const UPDATE_DELAY_MS = 1_000 / 50;

async function configureOsuDir(mainWindow: BrowserWindow) {
  let tables: Awaited<DirParseResult>;
  const settings = Storage.getTable("settings");

  while (true) {
    await Router.dispatch(mainWindow, "changeScene", "dir-select");
    const dirData = await dirSubmit();

    await Router.dispatch(mainWindow, "changeScene", "loading");
    await Router.dispatch(mainWindow, "loadingScene::setTitle", "Importing songs from osu!");

    // Wrap client update function to update only every UPDATE_DELAY_MS
    const [update, cancelUpdate] = throttle(async (i: number, total: number, file: string) => {
      await Router.dispatch(mainWindow, "loadingScene::update", {
        current: i,
        max: total,
        hint: file,
      });
    }, UPDATE_DELAY_MS);

    if (dirData.version == "stable") {
      tables = await OsuParser.parseStableDatabase(dirData.path, update);
    } else {
      tables = await OsuParser.parseLazerDatabase(dirData.path, update);
    }
    // Cancel ongoing throttled update, so it does not look bad when it finishes and afterward the update overwrites
    // finished state
    cancelUpdate();

    if (tables.isError) {
      await showError(mainWindow, tables.error);
      // Try again
      continue;
    }

    if (tables.value[SONGS].size === 0) {
      await showError(
        mainWindow,
        `No songs found in folder: ${dirData.path}. Please make sure this is the directory where you have all your songs saved.`,
      );
      // Try again
      continue;
    }

    // All went smoothly. Save osu directory and continue with import procedure
    settings.write("osuSongsDir", dirData.path);
    break;
  }

  // Show finished state
  await Router.dispatch(mainWindow, "loadingScene::update", {
    max: tables.value[SONGS].size,
    current: tables.value[SONGS].size,
    hint: `Imported total of ${tables.value[SONGS].size} songs`,
  });

  // Save created tables
  const songs = Object.fromEntries(tables.value[SONGS]);
  Storage.setTable("songs", songs);
  Storage.setTable("audio", Object.fromEntries(tables.value[AUDIO]));
  Storage.setTable("images", Object.fromEntries(tables.value[IMAGES]));

  // Start indexing songs
  const total = Object.values(songs).length;
  await Router.dispatch(mainWindow, "loadingScene::setTitle", "Indexing songs");

  // Wrap client update function to update only every UPDATE_DELAY_MS
  const [update, cancelUpdate] = throttle(async (i: number, song: string) => {
    await Router.dispatch(mainWindow, "loadingScene::update", {
      current: i,
      hint: song,
      max: total,
    });
  }, UPDATE_DELAY_MS);

  const [indexes, tags] = collectTagsAndIndexSongs(songs, update);
  // Cancel ongoing throttled update, so it does not look bad when it finishes and afterward the update overwrites
  // finished state
  cancelUpdate();

  const system = Storage.getTable("system");

  // Write batch of updates to system table
  system.hold();
  system.write("indexes", indexes);
  system.write("allTags", Object.fromEntries(tags));
  system.writeBack();

  // Display finished state
  await Router.dispatch(mainWindow, "loadingScene::update", {
    current: total,
    hint: "Indexed " + total + " songs",
    max: total,
  });
}
