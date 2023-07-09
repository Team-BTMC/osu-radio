import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { filter } from '../lib/song/filter';



const BUFFER_SIZE = 50;

Router.respond("querySongsPool", (_evt, i, payload) => {
  const songs = filter(payload);

  if (songs === undefined) {
    return none();
  }

  if (i * BUFFER_SIZE >= songs.length) {
    return none();
  }

  return some({
    index: i + 1,
    total: songs.length,
    items: songs.slice(i * BUFFER_SIZE, (i + 1) * BUFFER_SIZE)
  });
});