import { Router } from "./lib/route-pass/Router";
import createMenu from "./lib/window/menu";
import trackBounds, { getBounds, wasMaximized } from "./lib/window/resizer";
import { main } from "./main";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, dialog } from "electron";
import { join } from "path";

if (!app.requestSingleInstanceLock()) app.quit();

async function createWindow() {
  const [width, height] = getBounds();

  function getIcon(): string {
    if (process.platform === "win32") {
      return join(__dirname, "../../build/icon.ico");
    }

    if (process.platform === "darwin") {
      return join(__dirname, "../../build/icon.icns");
    }

    return join(__dirname, "../../build/icon.png");
  }

  const window = new BrowserWindow({
    title: "osu!radio",
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 20,
      y: 24,
    },
    icon: getIcon(),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      webSecurity: false,
    },
    /* To be uncommented whenever the title bar is removed and
    native buttons are added

    titleBarOverlay: {
      color: "#00000000", // transparent bg for the buttons
      symbolColor: "#FFFFFF", // the icons are white
      height: 30,
    },
    */
  });

  const menu = createMenu();
  window.setMenu(menu);

  app.on("second-instance", () => {
    if (window.isMinimized()) window.restore();
    window.focus();
  });

  window.on("maximize", () => {
    Router.dispatch(window, "window::maximizeChange", true);
  });

  window.on("unmaximize", () => {
    Router.dispatch(window, "window::maximizeChange", false);
  });

  if (wasMaximized()) {
    window.maximize();
  }

  trackBounds(window);

  window.on("ready-to-show", async () => {
    window.show();
    await Router.dispatch(window, "changeScene", "main");
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for hot reloading or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    await window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    await window.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Launch main app logic
  await main(window).catch((error) => {
    if (error === null || error === undefined) {
      dialog.showErrorBox("Unknown error occurred.", "Idk what you should do tbh");
      return;
    }

    dialog.showErrorBox(
      "Report to the developer team to fix",
      (error as Error).stack ?? String(error),
    );
  });
}

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.osu-radio");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window, {
      zoom: true,
      escToCloseWindow: false,
    });
  });

  await createWindow();

  app.on("activate", async () => {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
