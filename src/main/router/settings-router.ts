import { Router } from "@main/lib/route-pass/Router";
import { Storage } from "@main/lib/storage/Storage";
import { app } from "electron";
import os from "os";

Router.respond("settings::get", (_evt, key) => {
  return Storage.getTable("settings").get(key);
});

Router.respond("settings::write", (_evt, key, value) => {
  Storage.getTable("settings").write(key, value);
});

Router.respond("settings::DeleteSongData", () => {
  Storage.getTable("settings").delete("osuSongsDir");
  Storage.removeTable("songs");
  Storage.removeTable("audio");
  Storage.removeTable("images");
  Storage.removeTable("system");
});

Router.respond("os::platform", () => {
  return os.platform();
});

Router.respond("app::restart", () => {
  app.relaunch();
  app.quit();
});
