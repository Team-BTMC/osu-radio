import type { LucideIcon } from "lucide-solid";
import { Layers3Icon, LayoutListIcon, MusicIcon, SettingsIcon } from "lucide-solid";
import { createSignal } from "solid-js";

export type Tab = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

export const TABS = {
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

const [mainActiveTab, setMainActiveTab] = createSignal<Tab["value"]>(TABS.SONGS.value);
export { mainActiveTab, setMainActiveTab };
