import { Router } from '../lib/route-pass/Router';
import { Storage } from '../lib/storage/Storage';
import { delay } from '../lib/delay-backend';
import { AudioSource, ResourceID } from '../../@types';
import { DELAY_MS } from '../main';



const [writeAudioSource, ] = delay((audioID: ResourceID, audioSource: AudioSource) => {
  Storage.getTable("audio").write(audioID, audioSource);
}, DELAY_MS);

Router.respond("saveLocalVolume", (_evt, localVolume, songID) => {
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