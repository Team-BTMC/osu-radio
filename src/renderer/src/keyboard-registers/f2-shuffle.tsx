import { addNotice } from "../components/notice/NoticeContainer";
import { Keyboard } from "../lib/Keyboard";
import { mainActiveTab, TABS } from "@renderer/scenes/main-scene/main.utils";
import { ShuffleIcon } from 'lucide-solid'

Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue::shuffle");

    if (mainActiveTab() !== TABS.SONGS.value) {
      return;
    }

    addNotice({
      title: "Shuffled",
      icon: <ShuffleIcon size={20}/>,
      description: "The current queue has been shuffled.",
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
      description: "This is a test notice.",
    });
  },
});

Keyboard.register({
  key: "F4",
  onPress: () => {
    addNotice({
      variant: "error",
      title: "Testing",
      icon: <ShuffleIcon size={20} stroke="rgba(var(--color-red))" />,
      description: "This is a test notice. This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.This is a test notice.",
    });
  },
});
