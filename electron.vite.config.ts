import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import devtools from "solid-devtools/vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";
import solid from "vite-plugin-solid";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [
      lucidePreprocess(),
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
