import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { dialog } from 'electron';
import path from "path";



let waitList: ((dir: string) => void)[] = [];

Router.respond("dir::select", () => {
  const path = dialog.showOpenDialogSync({
    title: "Select your osu! Songs folder",
    properties: ["openDirectory"]
  });

  if (path === undefined) {
    return none();
  }

  return some(path[0]);
});

Router.respond("dir::autoGetOsuSongsDir", () => {
  if (process.env.LOCALAPPDATA === undefined) {
    return none();
  }

  return some(path.join(process.env.LOCALAPPDATA, "osu!", "Songs"));
});

Router.respond("dir::submit", (_evt, dir) => {
  for (let i = 0; i < waitList.length; i++) {
    waitList[i](dir);
  }

  waitList = [];
});



export function dirSubmit(): Promise<string> {
  return new Promise(resolve => {
    waitList.push(resolve);
  });
}