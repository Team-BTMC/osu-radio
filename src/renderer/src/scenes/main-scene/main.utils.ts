import type { LucideIcon } from "lucide-solid";
import { ListMusicIcon, MusicIcon, SettingsIcon } from "lucide-solid";
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
    Icon: ListMusicIcon,
  },
  SETTINGS: {
    label: "Settings",
    value: "settings",
    Icon: SettingsIcon,
  },
} as const satisfies Record<string, Tab>;

const [mainActiveTab, setMainActiveTab] = createSignal<Tab["value"]>(TABS.SONGS.value);
export { mainActiveTab, setMainActiveTab };
