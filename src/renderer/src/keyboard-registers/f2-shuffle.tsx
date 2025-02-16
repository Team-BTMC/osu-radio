import { addNotice } from "@renderer/components/notice/NoticeContainer";
import { Keyboard } from "@renderer/lib/Keyboard";
import { sidebarActiveTab, SIDEBAR_PAGES } from "@renderer/scenes/main-scene/main.utils";
import { ShuffleIcon } from "lucide-solid";

Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue::shuffle");

    if (sidebarActiveTab() !== SIDEBAR_PAGES.SONGS.value) {
      return;
    }

    addNotice({
      title: "Shuffled",
      icon: <ShuffleIcon size={20} />,
      description: "The current queue has been shuffled.",
    });
  },
});
