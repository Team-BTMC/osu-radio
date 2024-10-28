import { Router } from "@main/lib/route-pass/Router";
import { mainWindow } from "@main/main";

Router.respond("window::maximize", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return;
  }
  mainWindow.maximize();
});

Router.respond("window::isMaximized", () => {
  try {
    return mainWindow.isMaximized();
  } catch {
    return false;
  }
});

Router.respond("window::minimize", () => {
  mainWindow.minimize();
});

Router.respond("window::close", () => {
  mainWindow.close();
});
