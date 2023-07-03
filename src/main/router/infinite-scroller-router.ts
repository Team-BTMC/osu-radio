import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import Global from '../lib/Global';
import { Song } from '../../@types';



const BUFFER_SIZE = 20;

Router.respond("allSongs", (_evt, index) => {
  const songs = Global.cache.get("songs") as Song[];

  if (songs === undefined) {
    return none();
  }

  if (index * BUFFER_SIZE >= songs.length) {
    return none();
  }

  return some({
    index: index + 1,
    items: songs.slice(index * BUFFER_SIZE, (index + 1) * BUFFER_SIZE)
  });
});