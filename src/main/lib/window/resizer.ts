import { orDefault } from "@shared/lib/rust-types/Optional";
import { Storage } from "@main/lib/storage/Storage";
import { BrowserWindow } from "electron";
import { Router } from "@main/lib/route-pass/Router";

/**
 * Save window dimensions so that it can be opened the same size it was closed
 * @param window
 */
export default function trackBounds(window: BrowserWindow): void {
  const settings = Storage.getTable("settings");

  window.on("resized", () => {
    const bounds = window.getBounds();
    settings.write("window.width", bounds.width);
    settings.write("window.height", bounds.height);

    // Send a notice about the window resize
    Router.dispatch(window, "notify", {
      variant: "neutral",
      title: "Window Resized",
      description: `New dimensions: ${bounds.width}x${bounds.height}`,
      icon: "maximize-icon"
    });
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
