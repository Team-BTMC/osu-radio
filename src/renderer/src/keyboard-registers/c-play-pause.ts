import { Keyboard } from "@/lib/Keyboard";
import { togglePlay } from "@/components/song/song.utils";

Keyboard.register({
  key: "c",
  onPress: async () => {
    await togglePlay();
  },
});
