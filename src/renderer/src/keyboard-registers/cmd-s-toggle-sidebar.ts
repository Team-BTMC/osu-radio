import { Keyboard } from "../lib/Keyboard";
import { setActive } from "@renderer/scenes/main-scene/MainScene";

Keyboard.register({
  key: "s",
  modifiers: ["cmd"],
  onPress: () => {
    setActive((a) => !a);
  },
});
