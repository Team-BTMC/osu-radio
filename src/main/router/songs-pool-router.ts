import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { filter } from '../lib/song/filter';
import order from '../lib/song/order';
import { indexMapper } from '../lib/song/indexMapper';
import { Storage } from '../lib/storage/Storage';



Router.respond("query.songsPool.init", () => {
  const indexes = Storage.getTable("system").get("indexes");

  if (indexes.isNone || indexes.value.length === 0) {
    return none();
  }

  return some({
    initialIndex: 0
  });
});

const BUFFER_SIZE = 50;

Router.respond("query.songsPool", (_evt, request, payload) => {
  if (request.direction === "up") {
    return none();
  }

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

  if (request.index * BUFFER_SIZE >= songs.length) {
    return none();
  }

  return some({
    index: request.index + 1,
    total: songs.length,
    items: songs.slice(request.index * BUFFER_SIZE, (request.index + 1) * BUFFER_SIZE)
  });
});