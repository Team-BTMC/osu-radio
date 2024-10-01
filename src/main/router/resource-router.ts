import { Router } from "../lib/route-pass/Router";
import { Storage } from "../lib/storage/Storage";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
import { fail, ok } from "../lib/rust-like-utils-backend/Result";
import path from "path";
import sharp from "sharp";

Router.respond("resource::getPath", (_evt, id) => {
  if (id === undefined) {
    return fail("Can not find resource for 'undefined'.");
  }

  const osuDir = Storage.getTable("settings").get("osuSongsDir");

  if (osuDir.isNone) {
    return fail("Could not provide absolute path because osu! Songs folder is undefined.");
  }

  // todo User may have spaces in osuDir if they are not using default path. Ensure that the whole path is valid URL
  return ok(osuDir.value + "/" + encodeFile(id));
});

Router.respond("resource::getMediaSessionImage", async (_evt, bgPath) => {
  const settings = Storage.getTable("settings");
  const songsDir = settings.get("osuSongsDir");
  if (songsDir.isNone) {
    return none();
  }

  const pathToBg = path.join(songsDir.value, bgPath);
  if (pathToBg === undefined) {
    // handle no bg
    return none();
  }
  const mimeType = `image/${path.extname(pathToBg).slice(1)}`;
  const buffer = await sharp(pathToBg).resize(512, 512).toBuffer();

  return some(`data:${mimeType};base64,${buffer.toString("base64")}`);
});

function encodeFile(uri: string): string {
  return uri
    .split(/[\/\\]/)
    .map((s) => encodeURIComponent(s))
    .join("/");
}

Router.respond("resource::get", (_evt, id, table) => {
  return Storage.getTable(table).get(id);
});
