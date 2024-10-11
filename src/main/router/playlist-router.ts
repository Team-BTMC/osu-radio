import { Playlist } from "../../@types";
import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
import { Storage } from "../lib/storage/Storage";

Router.respond("playlist::add", (_evt, playlistName, song) => {
  const playlists = Storage.getTable("playlists");
  const playlist = playlists.get(playlistName);

  if (playlist.isNone) {
    return;
  }

  playlist.value.songs.push(song);
  playlist.value.count = playlist.value.count + 1;
  playlist.value.length = playlist.value.length + song.duration;
  playlists.write(playlistName, playlist.value);
});

Router.respond("playlist::create", (_evt, name) => {
  console.log("create playlist " + name);
  //todo: check if playlist already exists
  const playlists = Storage.getTable("playlists");
  const empty = { name: name, count: 0, length: 0, songs: [] };
  playlists.write(name, empty);
});

Router.respond("playlist::delete", (_evt, name) => {
  console.log("delete playlist " + name);
  const playlists = Storage.getTable("playlists");
  playlists.delete(name);
});

Router.respond("playlist::remove", (_evt, playlistName, song) => {
  console.log("delete song from " + playlistName, song);
  const playlists = Storage.getTable("playlists");
  const playlist = playlists.get(playlistName);

  if(playlist.isNone){
    return;
  }

  const songIndex = playlist.value.songs.indexOf(song, 0);
  if (songIndex > -1) {
    playlist.value.songs.splice(songIndex, 1);
    playlists.write(playlistName, playlist.value);
  }
});

const BUFFER_SIZE = 50;

Router.respond("query::playlists::init", (_evt) => {
  const playlists = Storage.getTable("playlists").getStruct();
  const count = Object.keys(playlists).length;

  return some({
    initialIndex: 0,
    count: count,
  });
});

Router.respond("query::playlists", (_evt, request) => {
  const playlists = Object.keys(Storage.getTable("playlists").getStruct());

  //todo: there has to be a better way to do this
  const p = Storage.getTable("playlists");
  const playlistsInfo: Playlist[] = [];
  playlists.forEach((v) => {
    const plist = p.get(v);

    if(plist.isNone){
      return;
    }

    playlistsInfo.push({
      name: v,
      count: plist.value.count,
      length: plist.value.length,
      songs: plist.value.songs,
    });
  });

  if (
    playlistsInfo === undefined ||
    request.index < 0 ||
    request.index > Math.floor(playlistsInfo.length / BUFFER_SIZE)
  ) {
    return none();
  }

  const start = request.index * BUFFER_SIZE;

  if (request.direction === "up") {
    return some({
      index: request.index - 1,
      total: playlistsInfo.length,
      items: playlistsInfo.slice(start, start + BUFFER_SIZE),
    });
  }

  return some({
    index: request.index + 1,
    total: playlistsInfo.length,
    items: playlistsInfo.slice(start, start + BUFFER_SIZE),
  });
});

Router.respond("query::playlistSongs::init", (_evt, playlistName) => {
  const songs = Storage.getTable("playlists").get(playlistName);

  if(songs.isNone){
    return none();
  }

  const count = Object.keys(songs.value.songs).length;

  return some({
    initialIndex: 0,
    count: count,
  });
});

Router.respond("query::playlistSongs", (_evt, playlistName, request) => {
  const playlist = Storage.getTable("playlists").get(playlistName);

  if(playlist.isNone){
    return none();
  }

  const songs = playlist.value.songs;

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
      items: songs.slice(start, start + BUFFER_SIZE),
    });
  }

  return some({
    index: request.index + 1,
    total: songs.length,
    items: songs.slice(start, start + BUFFER_SIZE),
  });
});
