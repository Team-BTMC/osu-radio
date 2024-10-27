import { Router } from "@/lib/route-pass/Router";
import { Storage } from "@/lib/storage/Storage";

Router.respond("save::songColors", (_evt, primaryColor, secondaryColor, songID) => {
  const song = Storage.getTable("songs").get(songID);
  if (song.isNone) {
    return;
  }

  song.value.primaryColor = primaryColor;
  song.value.secondaryColor = secondaryColor;
  Storage.getTable("songs").write(songID, song.value);
});
