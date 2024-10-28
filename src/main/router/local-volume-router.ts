import { AudioSource, ResourceID } from "@shared/types/common.types";
import { delay } from "@main/lib/delay-backend";
import { Router } from "@main/lib/route-pass/Router";
import { Storage } from "@main/lib/storage/Storage";

const [writeAudioSource] = delay((audioID: ResourceID, audioSource: AudioSource) => {
  Storage.getTable("audio").write(audioID, audioSource);
}, 200);

Router.respond("save::localVolume", (_evt, localVolume, songID) => {
  const song = Storage.getTable("songs").get(songID);

  if (song.isNone) {
    return;
  }

  const audio = Storage.getTable("audio").get(song.value.audio);

  if (audio.isNone) {
    return;
  }

  audio.value.volume = localVolume;
  writeAudioSource(song.value.audio, audio.value);
});
