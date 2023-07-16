import { Router } from '../lib/route-pass/Router';
import { QueueCreatePayload, QueueView, Song, SongIndex } from '../../@types';
import { Storage } from '../lib/storage/Storage';
import { filter } from '../lib/song/filter';
import { indexMapper } from '../lib/song/indexMapper';



let queue: Song[];
let index = 0;
let lastPayload: QueueCreatePayload | undefined;

Router.respond("queueCreate", (_evt, payload) => {
  if (comparePayload(payload, lastPayload)) {
    index = payload.startIndex;
    lastPayload = payload;
    return;
  }

  queue = Array.from(indexMapper(filter(getIndexes(payload.view), payload)));
  index = payload.startIndex;
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

  if (current.searchQuery !== last.searchQuery) {
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

Router.respond('queueCurrent', () => {
  return queue[index];
});

Router.respond('queuePrevious', () => {
  if (--index < 0) {
    index = queue.length;
  }
});

Router.respond('queueNext', () => {
  if (++index === queue.length) {
   index = 0;
  }
});