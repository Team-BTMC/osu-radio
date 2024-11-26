CREATE TABLE `audio` (
	`songID` text NOT NULL,
	`path` text PRIMARY KEY NOT NULL,
	`ctime` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audio_songID_unique` ON `audio` (`songID`);--> statement-breakpoint
CREATE UNIQUE INDEX `audio_path_unique` ON `audio` (`path`);--> statement-breakpoint
CREATE TABLE `songs` (
	`audioPath` text NOT NULL,
	`OsuFile` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`ctime` integer,
	`dateAdded` text NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`creator` text NOT NULL,
	`BPM` text,
	`duration` real,
	`diffs` text,
	`artistUnicode` text NOT NULL,
	`titleUnicode` text NOT NULL,
	`beatmapSetId` integer NOT NULL,
	`mode` integer NOT NULL,
	`tags` text,
	`bg` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `songs_OsuFile_unique` ON `songs` (`OsuFile`);--> statement-breakpoint
CREATE TABLE `test` (
	`test` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `test_test_unique` ON `test` (`test`);