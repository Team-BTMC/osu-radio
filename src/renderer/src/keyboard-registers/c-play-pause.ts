import { Keyboard } from "@renderer/lib/Keyboard";
import { togglePlay } from "@renderer/components/song/song.utils";

Keyboard.register({
  key: "c",
  onPress: async () => {
    await togglePlay();
  },
});
