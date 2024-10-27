import { Song, SongIndex } from "@types";
import { Storage } from "@/lib/storage/Storage";

export function* indexMapper(indexes: SongIndex[]): Generator<Song> {
  for (let i = 0; i < indexes.length; i++) {
    const opt = Storage.getTable("songs").get(indexes[i].id);

    if (!opt.isNone) {
      yield opt.value;
    }
  }
}
