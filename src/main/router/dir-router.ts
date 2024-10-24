import { dialog } from "electron";
import fs from "fs";
import path from "path";
import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";

export type OsuDirectory = {
  version: "stable" | "lazer" | "none";
  path: string;
};

Router.respond("dir::select", () => {
  const result = dialog.showOpenDialogSync({
    title: "Select your osu! folder",
    properties: ["openDirectory"],
  });

  if (result === undefined) {
    return none();
  }
  const p = result[0];

  if (fs.existsSync(path.join(p, "osu!.db"))) {
    return some({ version: "stable", path: p });
  } else if (fs.existsSync(path.join(p, "client.realm"))) {
    return some({ version: "lazer", path: p });
  } else {
    return none();
  }
});

function getStoragePath(iniPath: string) {
  const firstLine = fs.readFileSync(iniPath, "utf-8").split("=")[0];
  return firstLine.trim();
}

Router.respond("dir::autoGetOsuDirs", () => {
  if (process.platform === "win32") {
    const dirs: OsuDirectory[] = [];

    if (
      process.env.LOCALAPPDATA != undefined &&
      fs.existsSync(path.join(process.env.LOCALAPPDATA, "osu!"))
    ) {
      dirs.push({ version: "stable", path: path.join(process.env.LOCALAPPDATA, "osu!") });
    }

    if (process.env.APPDATA != undefined && fs.existsSync(path.join(process.env.APPDATA, "osu"))) {
      if (fs.existsSync(path.join(process.env.APPDATA, "osu", "client.realm"))) {
        dirs.push({ version: "lazer", path: path.join(process.env.APPDATA, "osu") });
      } else if (fs.existsSync(path.join(process.env.APPDATA, "osu", "storage.ini"))) {
        const p = getStoragePath(path.join(process.env.APPDATA, "osu", "storage.ini"));
        dirs.push({ version: "lazer", path: p });
      }
    }

    if (dirs.length > 0) {
      return some(dirs);
    } else {
      return none();
    }
  } else if (process.platform === "linux") {
    const dirs: OsuDirectory[] = [];
    const homePath = process.env.XDG_DATA_HOME ?? `${process.env.HOME}/.local/share`;

    if (homePath != undefined && fs.existsSync(path.join(homePath, "osu-wine", "osu!"))) {
      dirs.push({
        version: "stable",
        path: path.join(homePath, "osu-wine", "osu!"),
      });
    }

    if (homePath != undefined && fs.existsSync(path.join(homePath, "osu"))) {
      if (fs.existsSync(path.join(homePath, "osu", "client.realm"))) {
        dirs.push({ version: "lazer", path: path.join(homePath, "osu") });
      } else if (fs.existsSync(path.join(homePath, "osu", "storage.ini"))) {
        const p = getStoragePath(path.join(homePath, "osu", "storage.ini"));
        dirs.push({ version: "lazer", path: p });
      }
    }

    if (dirs.length > 0) {
      return some(dirs);
    } else {
      return none();
    }
  } else if (process.platform === "darwin" && process.env.HOME) {
    if (
      fs.existsSync(
        path.join(process.env.HOME, "Library", "Application Support", "osu", "client.realm"),
      )
    ) {
      return some([
        {
          version: "lazer",
          path: path.join(process.env.HOME, "Library", "Application Support", "osu"),
        },
      ]);
    } else if (
      fs.existsSync(
        path.join(process.env.HOME, "Library", "Application Support", "osu", "storage.ini"),
      )
    ) {
      const p = getStoragePath(
        path.join(process.env.HOME, "Library", "Application Support", "osu", "storage.ini"),
      );
      return some([{ version: "lazer", path: p }]);
    }
    return none();
  }
  return none();
});

type DirSubmitResolve = (value: OsuDirectory) => void;

let pendingDirRequest: DirSubmitResolve | undefined = undefined;

Router.respond("dir::submit", (_evt, dir: OsuDirectory) => {
  if (pendingDirRequest) {
    pendingDirRequest(dir);

    pendingDirRequest = undefined;
  }
});

export function dirSubmit(): Promise<OsuDirectory> {
  return new Promise((resolve) => {
    pendingDirRequest = resolve;
  });
}
