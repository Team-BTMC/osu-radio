import type { LucideIcon } from "lucide-solid";
import { Layers3Icon, LayoutListIcon, MusicIcon, SettingsIcon } from "lucide-solid";
import { createSignal, onCleanup, onMount } from "solid-js";

export type Tab = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

export const SIDEBAR_PAGES = {
  SONGS: {
    label: "Songs",
    value: "songs",
    Icon: MusicIcon,
  },
  PLAYLISTS: {
    label: "Playlists",
    value: "playlists",
    Icon: LayoutListIcon,
  },
  QUEUE: {
    label: "Queue",
    value: "queue",
    Icon: Layers3Icon,
  },
  SETTINGS: {
    label: "Settings",
    value: "settings",
    Icon: SettingsIcon,
  },
} as const satisfies Record<string, Tab>;

export const NAV_ITEMS: Tab[] = [SIDEBAR_PAGES.SONGS, SIDEBAR_PAGES.PLAYLISTS] as const;

// --------------
// STATE
// --------------

export const [sidebarActiveTab, setSidebarActiveTab] = createSignal<Tab["value"]>(
  SIDEBAR_PAGES.SONGS.value,
);

export const [sidebarExpanded, setSidebarExpanded] = createSignal(true);

export const [animateSidebar, setAnimateSidebar] = createSignal(true);

export const [sidebarWidth, setSidebarWidth] = createSignal<number | undefined>(undefined);

// Initialize settings
window.api.request("settings::get", "sidebarWidth").then((v) => {
  setSidebarWidth(v.isNone ? 480 : v.value);
});

// Update settings
export async function settingsWriteSidebarWidth(width: number) {
  await window.api.request("settings::write", "sidebarWidth", width);
}

// Hooks
const DEFAULT_MAX_SIDEBAR_WIDTH = 880;
const LG_OFFSET_FROM_PANEL = 8;
export const useMainResizableOptions = () => {
  const [maxSidebarWidth, setMaxSidebarWidth] = createSignal(DEFAULT_MAX_SIDEBAR_WIDTH);
  const [offsetFromPanel, setOffsetFromPanel] = createSignal<number | undefined>(
    LG_OFFSET_FROM_PANEL,
  );

  onMount(() => {
    const resizeHandler = () => {
      // Small viewports
      if (window.innerWidth < 1024) {
        // Max width will be either 80% of the screen or the default max width,
        // we prioritize the smallerst
        setMaxSidebarWidth(Math.min(window.innerWidth * 0.8, DEFAULT_MAX_SIDEBAR_WIDTH));

        // There's no offset
        setOffsetFromPanel(undefined);
        return;
      }

      // Large view port
      // Max width will try to always left space for the player
      setMaxSidebarWidth(Math.min(window.innerWidth - 620, DEFAULT_MAX_SIDEBAR_WIDTH));
      // Recauculate sidebar size with the max contrain
      setSidebarWidth(Math.min(maxSidebarWidth(), sidebarWidth()!));

      // There should be the large panel offset
      setOffsetFromPanel(LG_OFFSET_FROM_PANEL);
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    onCleanup(() => {
      window.removeEventListener("resize", resizeHandler);
    });
  });

  return {
    maxSidebarWidth,
    offsetFromPanel,
  };
};
