import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
import { dialog } from "electron";
import path from "path";

Router.respond("dir::select", () => {
  const path = dialog.showOpenDialogSync({
    title: "Select your osu! folder",
    properties: ["openDirectory"],
  });

  if (path === undefined) {
    return none();
  }

  return some(path[0]);
});

Router.respond("dir::autoGetOsuDir", () => {
  if (process.platform === "win32") {
    if (process.env.LOCALAPPDATA === undefined) {
      return none();
    }
    return some(path.join(process.env.LOCALAPPDATA, "osu!"));
  } else if (process.platform === "linux") {
    if (process.env.XDG_DATA_HOME === undefined) {
      return none();
    }
    return some(path.join(process.env.XDG_DATA_HOME, "osu-wine", "osu!"));
  }
  return none();
});

type DirSubmitResolve = (value: { dir: string; client: "stable" | "lazer" }) => void;

let pendingDirRequest: DirSubmitResolve | undefined = undefined;

Router.respond("dir::submit", (_evt, dir, client) => {
  if (pendingDirRequest) {
    pendingDirRequest({ dir: dir, client: client });

    pendingDirRequest = undefined;
  }
});

export function dirSubmit(): Promise<{ dir: string; client: "stable" | "lazer" }> {
  return new Promise((resolve) => {
    pendingDirRequest = resolve;
  });
}
