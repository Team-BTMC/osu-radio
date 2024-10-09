import { Router } from "../lib/route-pass/Router";
import { Storage } from "../lib/storage/Storage";

Router.respond("playlist::add", (_evt, playlistName, song) => {
  console.log("add this to " + playlistName + ": " + song);

  const playlists = Storage.getTable("playlists");
  let playlist = playlists.get(playlistName);
  //temporary, playlist should already exist
  if (playlist.isNone) {
    // create playlist
    playlists.write(playlistName, []);
  }
  playlist = playlists.get(playlistName);

  playlist.value.push(song);
  playlists.write(playlistName, playlist.value);
  console.log("MONKA", playlists);
  console.log(playlist.value);
});
