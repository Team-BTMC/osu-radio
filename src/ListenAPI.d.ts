import { LoadingSceneUpdate, NoticeType, Scenes, Song } from "./@types";

export type ListenAPI = {
  changeScene: (scene: Scenes) => void;
  changeScene: (scene: Scenes) => void;

  "loadingScene::setTitle": (title: string) => void;
  "loadingScene::update": (update: LoadingSceneUpdate) => void;
  "loadingScene::setTitle": (title: string) => void;
  "loadingScene::update": (update: LoadingSceneUpdate) => void;

  "error::setMessage": (msg: string) => void;
  "error::setMessage": (msg: string) => void;

  "queue::songChanged": (song: Song) => void;
  "queue::created": () => void;
  "queue::destroyed": () => void;
  "queue::songChanged": (song: Song) => void;
  "queue::created": () => void;
  "queue::destroyed": () => void;

  "songView::reset": () => void;
  "songView::reset": () => void;

  notify: (notice: NoticeType) => void;
};

};
