import { Router } from "@main/lib/route-pass/Router";
import { filter } from "@main/lib/song/filter";
import { indexMapper } from "@main/lib/song/indexMapper";
import order from "@main/lib/song/order";
import { Storage } from "@main/lib/storage/Storage";
import { none, some } from "@shared/lib/rust-types/Optional";

Router.respond("query::songsPool::init", (_evt, payload) => {
  const indexes = Storage.getTable("system").get("indexes");

  if (indexes.isNone) {
    return none();
  }

  const filtered = filter(indexes.value, payload);

  return some({
    initialIndex: 0,
    count: filtered.length,
  });
});

const BUFFER_SIZE = 50;

Router.respond("query::songsPool", (_evt, request, payload) => {
  // Similar as for queue list pagination. Song pool is simpler that the direction may only be down

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
    items: songs.slice(request.index * BUFFER_SIZE, (request.index + 1) * BUFFER_SIZE),
  });
});
