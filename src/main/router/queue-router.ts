import { Router } from '../lib/route-pass/Router';
import { Optional, QueueCreatePayload, QueueView, Result, Song, SongIndex } from '../../@types';
import { Storage } from '../lib/storage/Storage';
import { filter } from '../lib/song/filter';
import { indexMapper } from '../lib/song/indexMapper';
import { mainWindow } from '../main';
import order from '../lib/song/order';
import errorIgnored from '../lib/tungsten/errorIgnored';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { shuffle } from '../lib/tungsten/collections';
import { fail, ok } from '../lib/rust-like-utils-backend/Result';



let queue: Song[];



Router.respond("queue::exists", () => {
  return queue !== undefined;
});



let index = 0;
let lastPayload: QueueCreatePayload | undefined;



Router.respond("queue::create", async (_evt, payload) => {
  if (comparePayload(payload, lastPayload)) {
    const newIndex = queue.findIndex(s => s.path === payload.startSong);

    if (newIndex === -1 || newIndex === index) {
      return;
    }

    index = newIndex;
    lastPayload = payload;
    await Router.dispatch(mainWindow, "queue::songChanged", queue[index])
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

  await Router.dispatch(mainWindow, "queue::created")
    .catch(errorIgnored);
  await Router.dispatch(mainWindow, "queue::songChanged", queue[index])
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



Router.respond("queue::duration", (): Optional<number> => {
  const d = duration();

  if (d.isError) {
    return none();
  }

  return some(d.value);
});

Router.respond("queue::remainingDuration", (): Optional<number> => {
  const d = duration(index);

  if (d.isError) {
    return none();
  }

  return some(d.value);
});

function duration(startIndex = 0): Result<number, string> {
  if (queue === undefined) {
    return fail("Queue is not defined.");
  }

  let sum = 0;

  for (let i = startIndex; i < queue.length; i++) {
    const s = queue[i];
    sum += s.duration;
  }

  return ok(sum);
}



Router.respond("queue::shuffle", async () => {
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

  await Router.dispatch(mainWindow, "queue::created")
    .catch(errorIgnored);
  await Router.dispatch(mainWindow, "queue::songChanged", queue[index])
    .catch(errorIgnored);
});



Router.respond("queue::place", (_evt, what, after) => {
  const whatIndex = queue.findIndex(s => s.path === what);

  if (whatIndex === -1) {
    return;
  }

  const s = queue[whatIndex];
  queue.splice(whatIndex, 1);

  if (after === undefined) {
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

  const afterIndex = queue.findIndex(s => s.path === after);

  if (afterIndex === -1) {
    queue.splice(whatIndex, 0, s);
    return;
  }

  queue.splice(afterIndex + 1, 0, s);

  if (whatIndex === index) {
    index = afterIndex + 1;
    return;
  }

  if (whatIndex > index && afterIndex < index) {
    // moved song that was after currently playing song before currently playing
    index++;
  }

  if (whatIndex < index && afterIndex + 1 >= index) {
    // moved song that was before currently playing song after currently playing
    index--;
  }
});



Router.respond("queue::play", async (_evt, song) => {
  const newIndex = queue.findIndex(s => s.path === song);

  if (newIndex === -1 || newIndex === index) {
    return;
  }

  index = newIndex;
  await Router.dispatch(mainWindow, "queue::songChanged", queue[index])
    .catch(errorIgnored);
});



Router.respond("queue::playNext", async (_evt, song) => {
  if (queue === undefined) {
    return;
  }

  const songIndex = queue.findIndex(s => s.path === song);

  if (songIndex === index) {
    return;
  }

  if (songIndex === -1) {
    const s = Storage.getTable("songs").get(song);

    if (s.isNone) {
      return
    }

    queue.splice(index + 1, 0, s.value);
  } else {
    const s = queue[songIndex];
    queue.splice(songIndex, 1);
    queue.splice(index + 1, 0, s);

    if (songIndex < index) {
      index--;
    }
  }

  await Router.dispatch(mainWindow, 'queue::created')
    .catch(errorIgnored);
});



Router.respond("queue::removeSong", async (_evt, what) => {
  if (what === undefined) {
    return;
  }

  console.log(index);

  const whatIndex = queue.findIndex(s => s.path === what);

  if (whatIndex === -1) {
    return;
  }

  if (whatIndex < index) {
    index--;
  }

  console.log(what, whatIndex, index);

  queue.splice(whatIndex, 1);

  await Router.dispatch(mainWindow, 'queue::created')
    .catch(errorIgnored);

  if (whatIndex === index) {
    await Router.dispatch(mainWindow, 'queue::songChanged', queue[index])
      .catch(errorIgnored);
  }
});



Router.respond('queue::current', () => {
  if (queue === undefined || queue[index] === undefined) {
    return none();
  }

  return some(queue[index]);
});



Router.respond('queue::previous', async () => {
  if (queue === undefined) {
    return;
  }

  if (--index < 0) {
    index = queue.length - 1;
  }

  await Router.dispatch(mainWindow, "queue::songChanged", queue[index])
    .catch(errorIgnored);
});



Router.respond('queue::next', async () => {
  if (queue === undefined) {
    return;
  }

  if (++index === queue.length) {
   index = 0;
  }

  await Router.dispatch(mainWindow, "queue::songChanged", queue[index])
    .catch(errorIgnored);
});



const BUFFER_SIZE = 50;

Router.respond("query::queue::init", () => {
  const count = queue !== undefined
    ? queue.length
    : 0;

  return some({
    initialIndex: Math.floor(index / BUFFER_SIZE),
    count
  });
});

Router.respond('query::queue', (_evt, request) => {
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