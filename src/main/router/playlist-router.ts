import { Playlist } from "../../@types";
import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
import { Storage } from "../lib/storage/Storage";

Router.respond("playlist::add", (_evt, playlistName, song) => {
  console.log("add this to " + playlistName + ": " + song);

  //Storage.removeTable("playlists");
  const playlists = Storage.getTable("playlists");
  let playlist = playlists.get(playlistName);
  //temporary, playlist should already exist
  if (playlist.isNone) {
    // create playlist
    const empty = { count: 0, length: 0, songs: [] };
    playlists.write(playlistName, empty);
  }
  playlist = playlists.get(playlistName);

  playlist.value.songs.push(song);
  playlist.value.count = playlist.value.count + 1;
  playlist.value.length = playlist.value.length + song.duration;
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

  //todo: there has to be a better way to do this
  const p = Storage.getTable("playlists");
  let test: Playlist[] = [];
  playlists.forEach((v) => {
    const plist = p.get(v);
    test.push({
      name: v,
      count: plist.value.count,
      length: plist.value.length,
      songs: plist.value.songs
    });
  });

  if (
    test === undefined ||
    request.index < 0 ||
    request.index > Math.floor(test.length / BUFFER_SIZE)
  ) {
    return none();
  }

  const start = request.index * BUFFER_SIZE;

  if (request.direction === "up") {
    return some({
      index: request.index - 1,
      total: test.length,
      items: test.slice(start, start + BUFFER_SIZE)
    });
  }

  return some({
    index: request.index + 1,
    total: test.length,
    items: test.slice(start, start + BUFFER_SIZE)
  });
});

Router.respond("query::playlistSongs::init", (_evt, playlistName) => {
  const songs = Storage.getTable("playlists").get(playlistName);
  const count = Object.keys(songs.value.songs).length;

  return some({
    initialIndex: 0,
    count: count
  });
});

Router.respond("query::playlistSongs", (_evt, playlistName, request) => {
  const songs = Storage.getTable("playlists").get(playlistName).value.songs;

  if (
    songs === undefined ||
    request.index < 0 ||
    request.index > Math.floor(songs.length / BUFFER_SIZE)
  ) {
    return none();
  }

  const start = request.index * BUFFER_SIZE;

  if (request.direction === "up") {
    return some({
      index: request.index - 1,
      total: songs.length,
      items: songs.slice(start, start + BUFFER_SIZE)
    });
  }

  return some({
    index: request.index + 1,
    total: songs.length,
    items: songs.slice(start, start + BUFFER_SIZE)
  });
});
