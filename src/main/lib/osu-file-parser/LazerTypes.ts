type BeatmapMetadata = {
  Title: string;
  TitleUnicode: string;
  Artist: string;
  ArtistUnicode: string;
  Author: { OnlineID: number; Username: string; CountryCode: string };
  Source: string;
  Tags: string;
  PreviewTime: number;
  AudioFile: string;
  BackgroundFile: string;
};

export type Beatmap = {
  ID: Realm.BSON.UUID;
  DifficultyName: string;
  Metadata: BeatmapMetadata;
  BeatmapSet: BeatmapSet;
  Status: number;
  OnlineID: number;
  Length: number;
  BPM: number;
  Hash: string;
  StarRating: number;
  MD5Hash: string;
  OnlineMD5Hash: string;
  LastLocalUpdate: string | null;
  LastOnlineUpdate: string | null;
  Hidden: boolean;
  EndTimeObjectCount: number;
  TotalObjectCount: number;
  AudioLeadIn: number;
  StackLeniency: number;
  SpecialStyle: boolean;
  LetterboxInBreaks: boolean;
  WidescreenStoryboard: boolean;
  EpilepsyWarning: boolean;
  SamplesMatchPlaybackRate: boolean;
  LastPlayed: string | null;
  DistanceSpacing: number;
  BeatDivisor: number;
  GridSize: number;
  TimelineZoom: number;
  EditorTimestamp: number;
  CountdownOffset: number;
};

type RealmFile = {
  File: {
    Hash: string;
  };
  Filename: string;
};

export type BeatmapSet = {
  ID: Realm.BSON.UUID;
  OnlineID: number;
  DateAdded: string;
  DateSubmitted: string;
  DateRanked: string | null;
  Beatmaps: Beatmap[];
  Status: number;
  DeletePending: boolean;
  Hash: string;
  Protected: boolean;
  Files: RealmFile[];
};
