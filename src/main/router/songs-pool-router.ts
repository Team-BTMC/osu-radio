import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { filter } from '../lib/song/filter';
import order from '../lib/song/order';



const BUFFER_SIZE = 50;

Router.respond("querySongsPool", (_evt, i, payload) => {
  const songs = filter(payload);

  const sortFN = order(payload.order);

  if (songs === undefined || sortFN.isError) {
    return none();
  }

  songs.sort(sortFN.value);

  if (i * BUFFER_SIZE >= songs.length) {
    return none();
  }

  return some({
    index: i + 1,
    total: songs.length,
    items: songs.slice(i * BUFFER_SIZE, (i + 1) * BUFFER_SIZE)
  });
});