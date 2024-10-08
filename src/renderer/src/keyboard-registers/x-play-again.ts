import { seek } from "@renderer/components/song/song.utils";
import { Keyboard } from "../lib/Keyboard";

Keyboard.register({
  key: "x",
  onPress: () => {
    seek(0);
  }
});
