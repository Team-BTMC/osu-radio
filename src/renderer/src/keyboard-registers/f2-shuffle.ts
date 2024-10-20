import { addNotice } from "../components/notice/NoticeContainer";
import { Keyboard } from "../lib/Keyboard";
import { mainActiveTab, SIDEBAR_PAGES } from "@renderer/scenes/main-scene/main.utils";

Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue::shuffle");

    if (mainActiveTab() !== SIDEBAR_PAGES.SONGS.value) {
      return;
    }

    addNotice({
      class: "notice",
      title: "Shuffled",
      content: "Current queue have been shuffled",
    });
  },
});
