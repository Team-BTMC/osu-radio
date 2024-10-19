import { createSignal } from "solid-js";

export type Tab = {
  label: string;
  value: string;
  icon: string;
};

export const TABS = {
  SONGS: {
    label: "Songs",
    value: "songs",
    icon: "ri-music-fill",
  },
  PLAYLISTS: {
    label: "Playlists",
    value: "playlists",
    icon: "ri-list-check",
  },
  QUEUE: {
    label: "Queue",
    value: "queue",
    icon: "ri-stack-fill",
  },
  SETTINGS: {
    label: "Settings",
    value: "settings",
    icon: "ri-settings-4-fill",
  },
} satisfies Record<string, Tab>;

const [mainActiveTab, setMainActiveTab] = createSignal(TABS.SONGS.value);
export { mainActiveTab, setMainActiveTab };
