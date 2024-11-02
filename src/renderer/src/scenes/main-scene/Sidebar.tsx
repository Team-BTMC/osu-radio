import Tabs from "@renderer/components/tabs/Tabs";
import { Component, createMemo, For } from "solid-js";
import {
  NAV_ITEMS,
  setSidebarActiveTab,
  setSidebarExpanded,
  SIDEBAR_PAGES,
  sidebarActiveTab,
  sidebarExpanded,
} from "./main.utils";
import SongList from "@renderer/components/song/song-list/SongList";
import { SettingsIcon, SidebarIcon } from "lucide-solid";
import Button from "@renderer/components/button/Button";
import Settings from "@renderer/components/settings/Settings";
import { Portal } from "solid-js/web";
import { os } from "@renderer/lib/os";

export const Sidebar: Component = () => {
  const toggleSidebarShow = () => {
    setSidebarExpanded((a) => !a);
  };

  return (
    <div
      class="sidebar transition-all relative"
      classList={{
        "w-[480px]": sidebarExpanded(),
        "w-0": !sidebarExpanded(),
      }}
    >
      <div class="absolute right-0 bottom-0 h-full flex flex-col gap-2  min-w-[480px]">
        <Portal>
          <Button
            size="square"
            variant="outlined"
            onClick={toggleSidebarShow}
            class="no-drag fixed z-10"
            classList={{
              // Windows/Linux - Offset for the nav on the top
              "top-[44px] left-[16px]": os() !== "darwin",

              // Mac     - Offset for the traffic lights on the left
              "top-[16px] left-[86px]": os() === "darwin",
            }}
          >
            <SidebarIcon size={20} />
          </Button>
        </Portal>

        <Tabs value={sidebarActiveTab} onValueChange={setSidebarActiveTab}>
          <SidebarTabs />
          <SidebarContent />
        </Tabs>
      </div>
    </div>
  );
};

const SidebarTabs: Component = () => {
  const configButtonVariant = createMemo(() => {
    return sidebarActiveTab() === SIDEBAR_PAGES.SETTINGS.value ? "secondary" : "outlined";
  });

  return (
    <div
      class="flex pl-4 pr-5 mt-2 ml-9 items-center no-drag"
      classList={{
        // Mac - Offset for the traffic lights on the left
        "pl-[86px] pt-2": os() === "darwin",
      }}
    >
      <Tabs.List class="ml-3 mr-auto">
        <For each={NAV_ITEMS}>
          {({ label, value, Icon }) => (
            <Tabs.Trigger value={value} class="app-no-drag">
              <Icon size={20} />
              <span>{label}</span>
            </Tabs.Trigger>
          )}
        </For>

        <Tabs.Indicator />
      </Tabs.List>

      <Button
        onClick={() => setSidebarActiveTab(SIDEBAR_PAGES.SETTINGS.value)}
        class="ml-auto"
        size="square"
        variant={configButtonVariant()}
      >
        <SettingsIcon size={20} />
      </Button>
    </div>
  );
};

const SidebarContent: Component = () => {
  return (
    <>
      <Tabs.Content value={SIDEBAR_PAGES.SONGS.value}>
        <SongList isAllSongs={true} />
      </Tabs.Content>
      <Tabs.Content value={SIDEBAR_PAGES.SETTINGS.value}>
        <Settings />
      </Tabs.Content>
    </>
  );
};
