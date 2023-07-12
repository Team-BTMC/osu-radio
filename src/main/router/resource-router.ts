import { Router } from '../lib/route-pass/Router';
import { Storage } from '../lib/storage/Storage';
import { fail, ok } from '../lib/rust-like-utils-backend/Result';
import path from 'path';



Router.respond("resourceGet", (_evt, id) => {
  const osuDir = Storage.getTable("settings").get("osuSongsDir");

  if (osuDir.isNone) {
    return fail("Could not provide absolute path because osu! Songs folder is undefined.");
  }

  return ok(path.join(osuDir.value, id));
});