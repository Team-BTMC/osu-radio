import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
import { dialog } from "electron";
import path from "path";

Router.respond("dir::select", () => {
  const path = dialog.showOpenDialogSync({
    title: "Select your osu! Songs folder",
    properties: ["openDirectory"],
  });

  if (path === undefined) {
    return none();
  }

  return some(path[0]);
});

Router.respond("dir::autoGetOsuSongsDir", () => {
  if (process.platform === "win32") {
    if (process.env.LOCALAPPDATA === undefined) {
      return none();
    }
    return some(path.join(process.env.LOCALAPPDATA, "osu!", "Songs"));
  } else if (process.platform === "linux") {
    if (process.env.XDG_DATA_HOME === undefined) {
      return none();
    }
    return some(path.join(process.env.XDG_DATA_HOME, "osu-wine", "osu!", "Songs"));
  }
  return none();
});

let pendingDirRequests: ((dir: string) => void)[] = [];

Router.respond("dir::submit", (_evt, dir) => {
  // Resolve all pending promises with value from client
  for (let i = 0; i < pendingDirRequests.length; i++) {
    pendingDirRequests[i](dir);
  }

  pendingDirRequests = [];
});

/**
 * Await submitted directory from client. This function works on suspending promise's resolve function in array of
 * pending requests. When user clicks Submit button the directory is passed to all pending resolve functions and the
 * promises are resolved
 */
export function dirSubmit(): Promise<string> {
  return new Promise((resolve) => {
    pendingDirRequests.push(resolve);
  });
}
