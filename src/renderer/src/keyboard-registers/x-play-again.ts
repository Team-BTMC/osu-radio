import { Keyboard } from "../lib/Keyboard";
import { seek } from "@renderer/components/song/song.utils";

Keyboard.register({
  key: "x",
  onPress: () => {
    seek(0);
  },
});
