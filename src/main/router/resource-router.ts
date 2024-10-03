import { Router } from "../lib/route-pass/Router";
import { fail, ok } from "../lib/rust-like-utils-backend/Result";
import { Storage } from "../lib/storage/Storage";

Router.respond("resource::getPath", (_evt, id) => {
  if (id === undefined) {
    return fail("Can not find resource for 'undefined'.");
  }

  const osuDir = Storage.getTable("settings").get("osuSongsDir");

  if (osuDir.isNone) {
    return fail("Could not provide absolute path because osu! Songs folder is undefined.");
  }

  // todo User may have spaces in osuDir if they are not using default path. Ensure that the whole path is valid URL
  return ok(encodeFile(id));
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
