import { addNotice } from "../components/notice/NoticeContainer";
import { Keyboard } from "../lib/Keyboard";
import { mainActiveTab, TABS } from "@renderer/scenes/main-scene/main.utils";

Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue::shuffle");

    if (mainActiveTab() !== TABS.SONGS.value) {
      return;
    }

    addNotice({
      title: "Shuffled",
      content: "The current queue has been shuffled.",
    });
  },
});

// testing:
Keyboard.register({
  key: "F3",
  onPress: () => {
    addNotice({
      variant: "success",
      title: "Testing",
      content: "This is a test notice.",
    });
  },
});

Keyboard.register({
  key: "F4",
  onPress: () => {
    addNotice({
      variant: "error",
      title: "Testing",
      content: "This is a test notice.",
    });
  },
});
