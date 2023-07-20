import { Router } from '../lib/route-pass/Router';
import { Storage } from '../lib/storage/Storage';



Router.respond("settings.get", (_evt, key) => {
  return Storage.getTable("settings").get(key);
});



Router.respond("settings.write", (_evt, key, value) => {
  Storage.getTable("settings").write(key, value);
});



Router.respond("settings.write.templateConfig", (_evt, config) => {
  Storage.getTable("settings").write("templateConfig", config.config);
});