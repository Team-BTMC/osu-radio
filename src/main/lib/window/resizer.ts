import { BrowserWindow } from 'electron';
import { Storage } from '../storage/Storage';
import { orDefault } from '../rust-like-utils-backend/Optional';



export default function trackBounds(window: BrowserWindow): void {
  const settings = Storage.getTable("settings");

  window.on("resized", () => {
    const bounds = window.getBounds();
    settings.write("window.width", bounds.width);
    settings.write("window.height", bounds.height);
  });

  window.on("unmaximize", () => {
    settings.write("window.isMaximized", false);
  });

  window.on("maximize", () => {
    settings.write("window.isMaximized", true);
  });
}



export function getBounds(): [number, number] {
  const settings = Storage.getTable("settings");

  return [
    orDefault(settings.get("window.width"), 900),
    orDefault(settings.get("window.height"), 670),
  ];
}

export function wasMaximized(): boolean {
  return orDefault(Storage.getTable("settings").get("window.isMaximized"), false);
}