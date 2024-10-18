import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const songsTable = sqliteTable("songs",{
  audio: text().notNull(),
  OsuFile: text().notNull().unique(),
  path: text().notNull,
  ctime: text(),
  dateAdded: text().notNull,
  title:text().notNull,
  artist: text().notNull(),
  creator: text().notNull(),
  BPM: text({mode: 'json'}),
  duration: real(),
  diffs: text({mode:'json'}),
  artistUnicode: text().notNull(),
  titleUnicode: text().notNull(),
  beatmapSetId: int().notNull(),
  mode: int().notNull(),
  tags: text({mode:'json'}),
  bg: text().notNull(),
} )
