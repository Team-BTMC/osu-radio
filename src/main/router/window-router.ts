import { Router } from "../lib/route-pass/Router";
import { mainWindow } from "../main";

Router.respond("window::maximize", (_evt) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return;
  }
  mainWindow.maximize();
});

Router.respond("window::isMaximized", (_evt) => {
  try {
    return mainWindow.isMaximized();
  } catch {
    return false;
  }
});

Router.respond("window::minimize", (_evt) => {
  mainWindow.minimize();
});

Router.respond("window::close", (_evt) => {
  mainWindow.close();
});
