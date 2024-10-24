import type { LucideIcon } from "lucide-solid";
import { MusicIcon, SettingsIcon } from "lucide-solid";
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
  SETTINGS: {
    label: "Settings",
    value: "settings",
    Icon: SettingsIcon,
  },
} as const satisfies Record<string, Tab>;

const [mainActiveTab, setMainActiveTab] = createSignal<Tab["value"]>(TABS.SONGS.value);
export { mainActiveTab, setMainActiveTab };
