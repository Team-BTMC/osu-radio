import type { LucideIcon } from "lucide-solid";
import { Layers3Icon, LayoutListIcon, MusicIcon, SettingsIcon } from "lucide-solid";
import { createSignal } from "solid-js";

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

const [mainActiveTab, setMainActiveTab] = createSignal<Tab["value"]>(SIDEBAR_PAGES.SONGS.value);
export { mainActiveTab, setMainActiveTab };
