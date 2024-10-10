import { Keyboard } from "../lib/Keyboard";
import { addNotice } from "../components/notice/NoticeContainer";
import { active, ACTIVE_QUEUE } from "../components/scenes/MainScene";

Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue::shuffle");

    if (active() === ACTIVE_QUEUE) {
      return;
    }

    addNotice({
      class: "notice",
      title: "Shuffled",
      content: "Current queue have been shuffled",
    });
  },
});
