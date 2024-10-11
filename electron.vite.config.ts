import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
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
    plugins: [solid(), lucidePreprocess()],
  },
});
