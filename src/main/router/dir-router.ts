import { Router } from "@main/lib/route-pass/Router";
import { none, some } from "@shared/lib/rust-types/Optional";
import { OsuDirectory } from "@shared/types/router.types";
import { dialog } from "electron";
import fs from "fs";
import path from "path";

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
  return fs.readFileSync(iniPath, "utf-8").split("=")[1].trim();
}

function getOsuDirectoriesByOS(platform: string): OsuDirectory[] {
  const dirs: OsuDirectory[] = [];

  if (platform === "win32") {
    // Windows
    if (
      process.env.LOCALAPPDATA !== undefined &&
      fs.existsSync(path.join(process.env.LOCALAPPDATA, "osu!"))
    ) {
      dirs.push({ version: "stable", path: path.join(process.env.LOCALAPPDATA, "osu!") });
    }

    if (process.env.APPDATA != undefined && fs.existsSync(path.join(process.env.APPDATA, "osu"))) {
      if (fs.existsSync(path.join(process.env.APPDATA, "osu", "storage.ini"))) {
        const p = getStoragePath(path.join(process.env.APPDATA, "osu", "storage.ini"));
        dirs.push({ version: "lazer", path: p });
      } else if (fs.existsSync(path.join(process.env.APPDATA, "osu", "client.realm"))) {
        dirs.push({ version: "lazer", path: path.join(process.env.APPDATA, "osu") });
      }
    }
  } else if (platform === "linux") {
    // Linux
    const homePath = process.env.XDG_DATA_HOME ?? `${process.env.HOME}/.local/share`;

    if (homePath != undefined && fs.existsSync(path.join(homePath, "osu-wine", "osu!"))) {
      dirs.push({
        version: "stable",
        path: path.join(homePath, "osu-wine", "osu!"),
      });
    }

    if (homePath != undefined && fs.existsSync(path.join(homePath, "osu"))) {
      if (fs.existsSync(path.join(homePath, "osu", "storage.ini"))) {
        const p = getStoragePath(path.join(homePath, "osu", "storage.ini"));
        dirs.push({ version: "lazer", path: p });
      } else if (fs.existsSync(path.join(homePath, "osu", "client.realm"))) {
        dirs.push({ version: "lazer", path: path.join(homePath, "osu") });
      }
    }
  } else if (platform === "darwin" && process.env.HOME) {
    // macOS
    const macOsuPath = path.join(process.env.HOME, "Library", "Application Support", "osu");

    if (fs.existsSync(path.join(macOsuPath, "storage.ini"))) {
      const p = getStoragePath(path.join(macOsuPath, "storage.ini"));
      dirs.push({ version: "lazer", path: p });
    } else if (fs.existsSync(path.join(macOsuPath, "client.realm"))) {
      dirs.push({ version: "lazer", path: macOsuPath });
    }
  }

  return dirs;
}

Router.respond("dir::autoGetOsuDirs", () => {
  const dirs = getOsuDirectoriesByOS(process.platform);

  if (dirs.length > 0) {
    return some(dirs);
  } else {
    return none();
  }
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
