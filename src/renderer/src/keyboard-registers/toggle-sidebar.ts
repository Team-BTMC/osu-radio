import { Keyboard } from "../lib/Keyboard";
import { setActive } from "@renderer/scenes/main-scene/MainScene";

Keyboard.register({
  key: "b",
  modifiers: ["cmd"],
  onPress: () => {
    setActive((a) => !a);
  },
});

Keyboard.register({
  key: "b",
  modifiers: ["ctrl"],
  onPress: () => {
    setActive((a) => !a);
  },
});
