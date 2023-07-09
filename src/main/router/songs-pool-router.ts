import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import Global from '../lib/Global';
import { Song } from '../../@types';



const BUFFER_SIZE = 50;

Router.respond("querySongsPool", (_evt, i, payload) => {
  if (payload.view.isAllSongs === true) {
    const songs = Global.cache.get("songs") as Song[];

    if (songs === undefined) {
      return none();
    }

    if (i * BUFFER_SIZE >= songs.length) {
      return none();
    }

    return some({
      index: i + 1,
      items: songs.slice(i * BUFFER_SIZE, (i + 1) * BUFFER_SIZE)
    });
  }

  return none();
});