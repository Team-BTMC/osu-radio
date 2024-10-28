import { setSidebarExpanded } from "@renderer/scenes/main-scene/main.utils";
import { Keyboard } from "../lib/Keyboard";

Keyboard.register({
  key: "b",
  modifiers: ["cmd"],
  onPress: () => {
    setSidebarExpanded((e) => !e);
  },
});

Keyboard.register({
  key: "b",
  modifiers: ["ctrl"],
  onPress: () => {
    setSidebarExpanded((e) => !e);
  },
});
