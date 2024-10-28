import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import lucidePreprocess from "vite-plugin-lucide-preprocess";
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
    plugins: [lucidePreprocess(), solid()],
  },
});
