import { Router } from '../lib/route-pass/Router';
import dialog = Electron.dialog;
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { Storage } from '../lib/storage/Storage';



Router.respond("dirSelect", () => {
  const path = dialog.showOpenDialogSync({
    title: "Select your osu! Songs directory",
    properties: ["openDirectory"]
  });

  if (path === undefined) {
    return none();
  }

  return some(path[0]);
});

Router.respond("dirSubmit", (_evt, dir) => {
  const settings = Storage.getTable("settings");
  settings.write("osuSongsDir", dir);
});
