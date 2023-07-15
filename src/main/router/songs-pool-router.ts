import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { filter } from '../lib/song/filter';
import order from '../lib/song/order';
import { indexMapper } from '../lib/song/indexMapper';
import { Storage } from '../lib/storage/Storage';



const BUFFER_SIZE = 50;

Router.respond("querySongsPool", (_evt, i, payload) => {
  const opt = Storage.getTable("system").get("indexes");

  if (opt.isNone) {
    return none();
  }

  const indexes = filter(opt.value, payload);

  const sortFN = order(payload.order);

  if (indexes === undefined || sortFN.isError) {
    return none();
  }

  const songs = Array.from(indexMapper(indexes));
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