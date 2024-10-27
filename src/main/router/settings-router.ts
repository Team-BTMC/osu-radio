import { Router } from "@/lib/route-pass/Router";
import { Storage } from "@/lib/storage/Storage";
import os from "os";

Router.respond("settings::get", (_evt, key) => {
  return Storage.getTable("settings").get(key);
});

Router.respond("settings::write", (_evt, key, value) => {
  Storage.getTable("settings").write(key, value);
});

Router.respond("os::platform", () => {
  return os.platform();
});
