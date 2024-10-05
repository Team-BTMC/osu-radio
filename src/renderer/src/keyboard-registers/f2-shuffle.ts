import { Keyboard } from "../lib/Keyboard";
import { addNotice } from "../components/notice/NoticeContainer";
import { mainActiveTab, TABS } from "@renderer/scenes/main-scene/main.utils";

Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue::shuffle");

    if (mainActiveTab() !== TABS.SONGS.value) {
      return;
    }

    addNotice({
      class: "notice",
      title: "Shuffled",
      content: "Current queue have been shuffled"
    });
  }
});
