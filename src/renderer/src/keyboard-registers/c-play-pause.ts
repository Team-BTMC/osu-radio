import { Keyboard } from "../lib/Keyboard";
import { togglePlay } from "../lib/Music";

Keyboard.register({
  key: "c",
  onPress: async () => {
    await togglePlay();
  },
});
