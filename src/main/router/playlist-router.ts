import { Playlist } from "../../@types";
import { Router } from "../lib/route-pass/Router";
import { none, some } from "../lib/rust-like-utils-backend/Optional";
import { fail, ok } from "../lib/rust-like-utils-backend/Result";
import { Storage } from "../lib/storage/Storage";
import errorIgnored from "../lib/tungsten/errorIgnored";
import { mainWindow } from "../main";

const BUFFER_SIZE = 50;

Router.respond("playlist::add", async (_evt, playlistName, song) => {
  const playlists = Storage.getTable("playlists");
  const playlist = playlists.get(playlistName);

  if (playlist.isNone) {
    return fail("Playlist does not exist");
  }

  const songs = Storage.getTable("songs");
  const songNew = songs.get(song.audio);

  if (songNew.isNone) {
    return fail("Couldn't fetch song");
  }

  if (songNew.value.playlists === undefined) {
    songNew.value.playlists = [];
  }

  // insert playlist name in the song
  songNew.value.playlists.push(playlistName);

  // rewrite song in storage
  songs.write(song.audio, songNew.value);

  // update the playlist
  playlist.value.songs.push(song);
  playlist.value.count = playlist.value.count + 1;
  playlist.value.length = playlist.value.length + song.duration;

  // rewrite the playlist in storage
  playlists.write(playlistName, playlist.value);

  // refresh windows, a song could be added from the queue so we basically refresh everything
  await Router.dispatch(mainWindow, "playlist::resetList").catch(errorIgnored);
  await Router.dispatch(mainWindow, "playlist::resetSongList").catch(errorIgnored);
  await Router.dispatch(mainWindow, "songView::reset").catch(errorIgnored);

  return ok({});
});

Router.respond("playlist::create", (_evt, name) => {
  const playlists = Storage.getTable("playlists");
  const playlistNames = Object.keys(playlists.getStruct());

  if (playlistNames.includes(name)) {
    return fail("Playlist already exists");
  }

  // write an empty playlist
  const empty = { name: name, count: 0, length: 0, songs: [] };
  playlists.write(name, empty);

  return ok({});
});

Router.respond("playlist::delete", (_evt, name) => {
  const playlists = Storage.getTable("playlists");
  const playlist = playlists.get(name);

  if (playlist.isNone) {
    return fail("Couldn't find playlist");
  }

  const songs = Storage.getTable("songs");

  playlist.value.songs.forEach((song) => {
    // getting the song everytime because the one in the playlist may not be up to date
    const songNew = songs.get(song.audio);

    if (songNew.isNone) {
      return fail("Couldn't fetch song");
    }

    if (songNew.value.playlists === undefined) {
      songNew.value.playlists = [];
    } else {
      // get the playlist index
      const playlistIndex = songNew.value.playlists.findIndex((p) => p === name);

      if (playlistIndex > -1) {
        // remove the playlist from the song
        songNew.value.playlists.splice(playlistIndex, 1);
        songs.write(song.audio, songNew.value);
      }
    }

    return;
  });

  // delete the playlist
  playlists.delete(name);

  return ok({});
});

Router.respond("playlist::remove", async (_evt, playlistName, song) => {
  const playlists = Storage.getTable("playlists");
  const playlist = playlists.get(playlistName);

  if (playlist.isNone) {
    return fail("Playlist does not exist");
  }

  // find the position of the song in the playlist, i assume that song.audio is the primary key
  const songIndex = playlist.value.songs.findIndex((s) => s.audio === song.audio);

  if (songIndex > -1) {
    // update the playlist
    playlist.value.songs.splice(songIndex, 1);
    playlist.value.count = playlist.value.count - 1;
    playlist.value.length = playlist.value.length - song.duration;

    // rewrite with the new playlist
    playlists.write(playlistName, playlist.value);

    // get the song to remove the playlist from its list
    const songs = Storage.getTable("songs");
    const songNew = songs.get(song.audio);

    if (songNew.isNone) {
      return fail("Couldn't fetch song");
    }

    if (songNew.value.playlists === undefined) {
      songNew.value.playlists = [];
    } else {
      // get the playlist index
      const playlistIndex = songNew.value.playlists.findIndex((p) => p === playlistName);

      if (playlistIndex > -1) {
        // remove the playlist from the song
        songNew.value.playlists.splice(playlistIndex, 1);
        songs.write(song.audio, songNew.value);
      }
    }

    // refresh the songList screen
    await Router.dispatch(mainWindow, "playlist::resetSongList").catch(errorIgnored);
    return ok({});
  }
  return fail("Song not found in playlist");
});

Router.respond("playlist::rename", (_evt, oldName, newName) => {
  const playlists = Storage.getTable("playlists");
  const oldPlaylist = playlists.get(oldName);

  if (oldPlaylist.isNone) {
    return fail("Playlist does not exist");
  }

  const playlistNames = Object.keys(playlists.getStruct());

  if (playlistNames.includes(newName)) {
    return fail("Playlist already exists");
  }

  // replace playlist with new name
  oldPlaylist.value.name = newName;
  playlists.write(newName, oldPlaylist.value);
  playlists.delete(oldName);

  const songs = Storage.getTable("songs");

  // replace the old playlist name with the new one for every song in the playlist
  oldPlaylist.value.songs.forEach((song) => {
    // getting the song everytime because the one in the playlist may not be up to date
    const songNew = songs.get(song.audio);

    if (songNew.isNone) {
      return fail("Couldn't fetch song");
    }

    if (songNew.value.playlists === undefined) {
      songNew.value.playlists = [newName];
    } else {
      // get the playlist index
      const playlistIndex = songNew.value.playlists.findIndex((p) => p === oldName);

      if (playlistIndex > -1) {
        // replace the playlist in the song
        songNew.value.playlists.splice(playlistIndex, 1);
        songNew.value.playlists.push(newName);
        songs.write(song.audio, songNew.value);
      }
    }

    return;
  });

  return ok({});
});

Router.respond("query::playlists::init", () => {
  const playlists = Storage.getTable("playlists").getStruct();
  const count = Object.keys(playlists).length;

  return some({
    initialIndex: 0,
    count: count,
  });
});

Router.respond("query::playlistNames", () => {
  const playlists = Storage.getTable("playlists").getStruct();
  const names = Object.keys(playlists);

  return some({
    playlistNames: names,
  });
});

Router.respond("query::playlists", (_evt, request) => {
  const playlistNames = Object.keys(Storage.getTable("playlists").getStruct());

  const playlists = Storage.getTable("playlists");
  const playlistsInfo: Playlist[] = [];
  playlistNames.forEach((name) => {
    const plist = playlists.get(name);

    if (plist.isNone) {
      return;
    }

    playlistsInfo.push({
      name: name,
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

Router.respond("query::playlistSongs::init", (_evt, payload) => {
  const songs = Storage.getTable("playlists").get(payload.playlistName);

  if (songs.isNone) {
    return none();
  }

  const count = Object.keys(songs.value.songs).length;

  return some({
    initialIndex: 0,
    count: count,
  });
});

Router.respond("query::playlistSongs", (_evt, request, payload) => {
  const playlist = Storage.getTable("playlists").get(payload.playlistName);

  if (playlist.isNone) {
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
