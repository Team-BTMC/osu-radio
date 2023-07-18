import { Router } from '../lib/route-pass/Router';
import { Storage } from '../lib/storage/Storage';



Router.respond("settingsGet", (_evt, key) => {
  return Storage.getTable("settings").get(key);
});



Router.respond("settingsWrite", (_evt, key, value) => {
  Storage.getTable("settings").write(key, value);
});