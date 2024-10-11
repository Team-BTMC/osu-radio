import { app, BrowserWindow, dialog, nativeTheme } from "electron";
import { join } from "path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { main } from "./main";
import trackBounds, { getBounds, wasMaximized } from "./lib/window/resizer";
import { Router } from "./lib/route-pass/Router";

async function createWindow() {
  const [width, height] = getBounds();

  //Gets the icon's path based on the users default theme preference.
  const getIconPath = () => {
    const iconPath =
      process.platform === 'win32'
        ? (nativeTheme.shouldUseDarkColors
          ? join(__dirname, '../../resources/icons/windows/dark.ico')
          : join(__dirname, '../../resources/icons/windows/light.ico'))
        : process.platform === 'darwin'
        ? (nativeTheme.shouldUseDarkColors
          ? join(__dirname, '../../resources/icons/macos/dark.icns')
          : join(__dirname, '../../resources/icons/macos/light.icns'))
        : (nativeTheme.shouldUseDarkColors
          ? join(__dirname, '../../resources/icons/linux/dark.png')
          : join(__dirname, '../../resources/icons/linux/light.png'));
          return(iconPath);
        }

  const window = new BrowserWindow({
    title: "osu!radio",
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    icon: getIconPath(),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      webSecurity: false,
    },
  });

  //Detects when theme is changed to change icon dynamically.
  nativeTheme.on('updated', () => {
    const icon = getIconPath(); 
    window.setIcon(icon);
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
    optimizer.watchWindowShortcuts(window);
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
