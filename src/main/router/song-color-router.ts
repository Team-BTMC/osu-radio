import { Router } from "@main/lib/route-pass/Router";
import { Storage } from "@main/lib/storage/Storage";

Router.respond("save::songColors", (_evt, primaryColor, secondaryColor, songID) => {
  const song = Storage.getTable("songs").get(songID);
  if (song.isNone) {
    return;
  }

  song.value.primaryColor = primaryColor;
  song.value.secondaryColor = secondaryColor;
  Storage.getTable("songs").write(songID, song.value);
});
