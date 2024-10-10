import { Keyboard } from "../lib/Keyboard";
import { seek } from "../lib/Music";

Keyboard.register({
  key: "x",
  onPress: () => {
    seek(0);
  },
});
