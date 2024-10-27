import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import lucidePreprocess from "vite-plugin-lucide-preprocess";
import solid from "vite-plugin-solid";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@src": resolve("src"),
        "@": resolve("src/main"),
        "@types": resolve("src/@types.d.ts"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        "@types": resolve("src/@types.d.ts"),
      },
    },
    plugins: [lucidePreprocess(), solid()],
  },
});
