import { Router } from '../lib/route-pass/Router';
import { Storage } from '../lib/storage/Storage';
import { fail, ok } from '../lib/rust-like-utils-backend/Result';



Router.respond("resourceGetPath", (_evt, id) => {
  const osuDir = Storage.getTable("settings").get("osuSongsDir");

  if (osuDir.isNone) {
    return fail("Could not provide absolute path because osu! Songs folder is undefined.");
  }

  return ok(osuDir.value + "/" + encodeFile(id));
});



function encodeFile(uri: string): string {
  return uri
    .split(/[\/\\]/)
    .map(s => encodeURIComponent(s))
    .join("/");
}



Router.respond("resourceGet", (_evt, id, table) => {
  return Storage.getTable(table).get(id);
});