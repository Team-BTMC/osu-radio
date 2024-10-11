import { Router } from "../lib/route-pass/Router";
import { Storage } from "../lib/storage/Storage";
import { mainWindow } from "../main";
import os from "os";

Router.respond("settings::get", (_evt, key) => {
  return Storage.getTable("settings").get(key);
});

Router.respond("settings::write", (_evt, key, value) => {
  Storage.getTable("settings").write(key, value);
});

Router.respond("settings::getos", (_evt) => {
  return os.platform();
});

Router.respond("settings::maximize", (_evt) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return;
  }
  mainWindow.maximize();
});

Router.respond("settings::maximized", (_evt) => {
  return mainWindow.isMaximized();
});

Router.respond("settings::minimize", (_evt) => {
  mainWindow.minimize();
});

Router.respond("settings::close", (_evt) => {
  mainWindow.close();
});
