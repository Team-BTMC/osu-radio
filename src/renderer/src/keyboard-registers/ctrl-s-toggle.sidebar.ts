import { Keyboard } from "../lib/Keyboard";
import { setActive } from "@renderer/scenes/main-scene/MainScene";

Keyboard.register({
  key: "s",
  modifiers: ["ctrl"],
  onPress: () => {
    setActive((a) => !a);
  },
});
