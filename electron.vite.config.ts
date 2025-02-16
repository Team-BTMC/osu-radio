import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import devtools from "solid-devtools/vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@shared": resolve("src/shared"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared"),
      },
    },
    plugins: [
      devtools({
        autoname: true,
        locator: {
          targetIDE: "vscode", // can also be "webstorm"
          componentLocation: true,
          jsxLocation: true,
        },
      }),
      solid(),
    ],
  },
});
