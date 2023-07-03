import { Router } from '../lib/route-pass/Router';
import { Storage } from '../lib/storage/Storage';
import { fail, ok } from '../lib/rust-like-utils-backend/Result';
import path from 'path';



Router.respond("resourceGet", (_evt, id, table) => {
  const entry = Storage.getTable(table).get(id);

  if (entry.isNone) {
    return fail("Resource not found");
  }

  const osuDir = Storage.getTable("settings").get("osuSongsDir");

  if (osuDir.isNone) {
    return fail("Could not provide absolute path because osu! Songs folder is undefined.");
  }

  console.log(path.join(osuDir.value, entry.value.path));

  return ok(path.join(osuDir.value, entry.value.path));
});