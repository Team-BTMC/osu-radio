import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
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

  //todo: check if song is already in playlist
  playlist.value.push(song);
  playlists.write(playlistName, playlist.value);
  console.log(
    "MONKA",
    playlists.getStruct(),
    Object.keys(Storage.getTable("playlists").getStruct())
  );
  console.log(playlist.value);
});

const BUFFER_SIZE = 50;

Router.respond("query::playlists::init", (_evt) => {
  const playlists = Storage.getTable("playlists").getStruct();
  const count = Object.keys(playlists).length;

  return some({
    initialIndex: 0,
    count: count
  });
});

Router.respond("query::playlists", (_evt, request) => {
  const playlists = Object.keys(Storage.getTable("playlists").getStruct());

  if (
    playlists === undefined ||
    request.index < 0 ||
    request.index > Math.floor(playlists.length / BUFFER_SIZE)
  ) {
    return none();
  }

  const start = request.index * BUFFER_SIZE;

  if (request.direction === "up") {
    return some({
      index: request.index - 1,
      total: playlists.length,
      items: playlists.slice(start, start + BUFFER_SIZE)
    });
  }

  return some({
    index: request.index + 1,
    total: playlists.length,
    items: playlists.slice(start, start + BUFFER_SIZE)
  });
});
