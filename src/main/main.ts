import { BrowserWindow } from 'electron';
import { Storage } from './lib/storage/Storage';
import { Router } from './lib/route-pass/Router';
import "./router/dir-router";
import { dirSubmit } from './router/dir-router';
import { OsuFileParser, UpdateSignalType } from './lib/osu-file-parser/OsuFileParser';
import { Signal } from './lib/Signal';



export async function main(window: BrowserWindow) {
  //todo testing only [2]
  const settings = Storage.getTable("settings");
  settings.delete("osuSongsDir");

  if (settings.get("osuSongsDir").isNone) {
    await Router.dispatch(window, "changeScene", "dir-select");
    const dir = await dirSubmit();

    await Router.dispatch(window, "changeScene", "loading");
    await Router.dispatch(window, "loadingSetTitle", "Importing songs from osu! Songs directory");

    const s = new Signal<UpdateSignalType>();
    let updateTimer: NodeJS.Timeout | undefined = undefined;
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

    const songs = await OsuFileParser.parseDir(dir, s);
    clearTimeout(updateTimer);

    if (songs.isError === true) {
      //todo show scene error -> "could not parse"
      return;
    }

    settings.write("osuSongsDir", dir);
    await Router.dispatch(window, "loadingUpdate", {
      max: songs.value.size,
      current: songs.value.size,
      hint: `Imported total of ${songs.value.size} songs`
    });
  }

}