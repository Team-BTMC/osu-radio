import { Router } from '../lib/route-pass/Router';
import { QueueCreatePayload, QueueView, Song, SongIndex } from '../../@types';
import { Storage } from '../lib/storage/Storage';
import { filter } from '../lib/song/filter';
import { indexMapper } from '../lib/song/indexMapper';
import { mainWindow } from '../main';
import order from '../lib/song/order';
import errorIgnored from '../lib/tungsten/errorIgnored';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { shuffle } from '../lib/tungsten/collections';



let queue: Song[];
let index = 0;
let lastPayload: QueueCreatePayload | undefined;

Router.respond("queue.create", async (_evt, payload) => {
  if (comparePayload(payload, lastPayload)) {
    const newIndex = queue.findIndex(s => s.path === payload.startSong);

    if (newIndex === -1 || newIndex === index) {
      return;
    }

    index = newIndex;
    lastPayload = payload;
    await Router.dispatch(mainWindow, "queue.songChanged", queue[index])
      .catch(errorIgnored);
    return;
  }

  lastPayload = payload;
  queue = Array.from(indexMapper(filter(getIndexes(payload.view), payload)));

  const ordering = order(payload.order);

  if (!ordering.isError) {
    queue.sort(ordering.value);
  }

  const songIndex = queue.findIndex(s => s.path === payload.startSong);

  if (songIndex !== -1) {
    index = songIndex;
  } else {
    index = 0;
  }

  await Router.dispatch(mainWindow, "queue.created")
    .catch(errorIgnored);
  await Router.dispatch(mainWindow, "queue.songChanged", queue[index])
    .catch(errorIgnored);
});

function getIndexes(view: QueueView): SongIndex[] {
  if (view.playlists !== undefined) {
    //todo implement multi playlist playback
    return [];
  }

  if (view.isAllSongs) {
    const indexes = Storage.getTable("system").get("indexes");
    if (indexes.isNone) {
      return [];
    }

    return indexes.value;
  }

  if (view.isQueue) {
    //todo maybe just forward pointer? This should not happen
    return [];
  }

  if (view.playlist) {
    //todo get playlist
    return [];
  }

  return [];
}

function comparePayload(current: QueueCreatePayload, last: QueueCreatePayload | undefined): boolean {
  if (last === undefined) {
    return false;
  }

  if (typeof current.searchQuery !== typeof last.searchQuery) {
    return false;
  }

  if (current.searchQuery !== undefined && last.searchQuery !== undefined) {
    if (current.searchQuery.query !== last.searchQuery.query) {
      return false;
    }
  }

  if (current.order !== last.order) {
    return false;
  }

  if (JSON.stringify(current.view) !== JSON.stringify(last.view)) {
    return false;
  }

  if (current.tags.length !== last.tags.length) {
    return false;
  }

  return JSON.stringify(current.tags) === JSON.stringify(last.tags);
}



Router.respond("queue.shuffle", async () => {
  if (queue === undefined) {
    return;
  }

  const current = queue[index].path;
  shuffle(queue);

  for (let i = 0; i < queue.length; i++) {
    if (queue[i].path !== current) {
      continue;
    }

    if (i === 0) {
      break;
    }

    const t = queue[i];
    queue[i] = queue[0];
    queue[0] = t;
    break;
  }

  index = 0;

  await Router.dispatch(mainWindow, "queue.created")
    .catch(errorIgnored);
  await Router.dispatch(mainWindow, "queue.songChanged", queue[index])
    .catch(errorIgnored);
});



Router.respond("queue.place", (_evt, what, before) => {
  const whatIndex = queue.findIndex(s => s.path === what);

  if (whatIndex === -1) {
    return;
  }

  const s = queue[whatIndex];
  queue.splice(whatIndex, 1);

  if (before === undefined) {
    queue.unshift(s);

    if (whatIndex === index) {
      index = 0;
      return;
    }

    if (whatIndex > index) {
      index++;
    }

    return;
  }

  const beforeIndex = queue.findIndex(s => s.path === before);

  if (beforeIndex === -1) {
    queue.splice(whatIndex, 0, s);
    return;
  }

  queue.splice(beforeIndex + 1, 0, s);

  if (whatIndex === index) {
    index = beforeIndex + 1;
    return;
  }

  if (whatIndex > index && beforeIndex < index) {
    // moved song that was after currently playing song before currently playing
    index++;
  }

  if (whatIndex < index && beforeIndex + 1 >= index) {
    // moved song that was before currently playing song after currently playing
    index--;
  }
});



Router.respond("queue.play", async (_evt, song) => {
  const newIndex = queue.findIndex(s => s.path === song);

  if (newIndex === -1 || newIndex === index) {
    return;
  }

  index = newIndex;
  await Router.dispatch(mainWindow, "queue.songChanged", queue[index])
    .catch(errorIgnored);
});



Router.respond('queue.current', () => {
  if (queue[index] === undefined) {
    return none();
  }

  return some(queue[index]);
});

Router.respond('queue.previous', async () => {
  if (--index < 0) {
    index = queue.length - 1;
  }

  await Router.dispatch(mainWindow, "queue.songChanged", queue[index])
    .catch(errorIgnored);
});

Router.respond('queue.next', async () => {
  if (++index === queue.length) {
   index = 0;
  }

  await Router.dispatch(mainWindow, "queue.songChanged", queue[index])
    .catch(errorIgnored);
});



const BUFFER_SIZE = 50;

Router.respond("query.queue.init", () => {
  if (queue === undefined) {
    return none();
  }

  return some({
    initialIndex: Math.floor(index / BUFFER_SIZE)
  });
});

Router.respond('query.queue', (_evt, request) => {
  if (queue === undefined || request.index < 0 || request.index > Math.floor(queue.length / BUFFER_SIZE)) {
    return none();
  }

  const start = request.index * BUFFER_SIZE;

  if (request.direction === "up") {
    return some({
      index: request.index - 1,
      total: queue.length,
      items: queue.slice(start, start + BUFFER_SIZE)
    });
  }

  return some({
    index: request.index + 1,
    total: queue.length,
    items: queue.slice(start, start + BUFFER_SIZE)
  });
});