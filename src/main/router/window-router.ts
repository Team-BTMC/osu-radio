import { Router } from "../lib/route-pass/Router";
import { mainWindow } from "../main";

Router.respond("window::maximize", (_evt) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return;
  }
  mainWindow.maximize();
});

Router.respond("window::maximized", (_evt) => {
  return mainWindow.isMaximized();
});

Router.respond("window::minimize", (_evt) => {
  mainWindow.minimize();
});

Router.respond("window::close", (_evt) => {
  mainWindow.close();
});
