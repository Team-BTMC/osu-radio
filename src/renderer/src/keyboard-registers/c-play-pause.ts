import { togglePlay } from "@renderer/components/song/song.utils";
import { Keyboard } from "../lib/Keyboard";

Keyboard.register({
  key: "c",
  onPress: async () => {
    await togglePlay();
  }
});
