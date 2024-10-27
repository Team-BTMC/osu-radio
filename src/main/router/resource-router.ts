import defaultBackground from "../../renderer/src/assets/osu-default-background-small.jpg";
import { Router } from "@/lib/route-pass/Router";
import { none, some } from "@shared/lib/rust-types/Optional";
import { fail, ok } from "@shared/lib/rust-types/Result";
import { Storage } from "@/lib/storage/Storage";
import path from "path";
import sharp from "sharp";
import { pathToFileURL } from "url";

Router.respond("resource::getPath", (_evt, path) => {
  if (path === undefined) {
    return fail("Can not find resource for 'undefined'.");
  }

  const osuDir = Storage.getTable("settings").get("osuSongsDir");

  if (osuDir.isNone) {
    return fail("Could not provide absolute path because osu! Songs folder is undefined.");
  }

  // todo User may have spaces in osuDir if they are not using default path. Ensure that the whole path is valid URL
  return ok(pathToFileURL(path).href);
});

Router.respond("resource::getMediaSessionImage", async (_evt, bgPath) => {
  if (bgPath === undefined) {
    return some(defaultBackground);
  }
  const settings = Storage.getTable("settings");
  const songsDir = settings.get("osuSongsDir");
  if (songsDir.isNone) {
    return none();
  }

  const mimeType = `image/${path.extname(bgPath).slice(1)}`;
  const buffer = await sharp(bgPath).resize(512, 512).toBuffer();

  return some(`data:${mimeType};base64,${buffer.toString("base64")}`);
});

Router.respond("resource::get", (_evt, id, table) => {
  return Storage.getTable(table).get(id);
});
