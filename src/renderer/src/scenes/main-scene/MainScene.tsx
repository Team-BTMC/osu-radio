import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, setMainActiveTab, Tab, TABS } from "./main.utils";
import IconButton from "@renderer/components/icon-button/IconButton";
import Settings from "@renderer/components/settings/Settings";
import SongImage from "@renderer/components/song/SongImage";
import SongQueue from "@renderer/components/song/song-queue/SongQueue";
import {
  songQueueModalOpen,
  toggleSongQueueModalOpen,
} from "@renderer/components/song/song-queue/song-queue.utils";
import { song } from "@renderer/components/song/song.utils";
import { Component, For, JSXElement, Match, Show, Switch } from "solid-js";

const MainScene: Component = () => {
  return (
    <div class="h-screen overflow-hidden flex flex-col">
      <Nav />
      <main class="relative h-[calc(100vh-52px)] flex">
        <TabContent />
        <div class="flex-1 flex items-center justify-center">
          <SongDetail />
        </div>

        <QueueModal />
      </main>

      <div class="absolute inset-0 z-[-1] pointer-events-none opacity-[0.072]">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="w-full h-full bg-cover filter blur-xl"
        />
      </div>
    </div>
  );
};

const Nav: Component = () => {
  return (
    <nav class="flex items-center h-[52px] px-5 bg-thick-material gap-1">
      <For each={Object.values(TABS)}>
        {({ label, ...rest }) => <NavItem {...rest}>{label}</NavItem>}
      </For>

      <div class="ml-auto">
        <IconButton
          class={`text-text-700 ${songQueueModalOpen() ? "text-text-900" : ""}`}
          onClick={toggleSongQueueModalOpen}
        >
          <i class="ri-stack-fill" />
        </IconButton>
      </div>
    </nav>
  );
};

type NavItemProps = Pick<Tab, "value" | "icon"> & {
  children: JSXElement;
};
const NavItem: Component<NavItemProps> = ({ children, value, icon }) => {
  return (
    <button
      class={`flex items-center gap-4 px-4 py-1 rounded-sm hover:bg-surface
        ${mainActiveTab() === value ? "bg-surface" : ""}`}
      onclick={() => setMainActiveTab(value)}
    >
      <i class={`${icon} ${mainActiveTab() === value ? "text-text" : "text-subtext"}`} />
      <span
        class={`text-base font-semibold ${mainActiveTab() === value ? "text-text" : "text-subtext"}`}
      >
        {children}
      </span>
    </button>
  );
};

const TabContent: Component = () => {
  return (
    <div class="overflow-y-auto w-[480px] min-w-[320px] h-full bg-opacity-72 bg-thick-material border-r border-stroke">
      <Switch fallback={<div>Tab not found</div>}>
        <Match when={mainActiveTab() === TABS.SONGS.value}>
          <SongList isAllSongs={true} />
        </Match>
        <Match when={mainActiveTab() === TABS.SETTINGS.value}>
          <Settings />
        </Match>
      </Switch>
    </div>
  );
};

const QueueModal: Component = () => {
  return (
    <Show when={songQueueModalOpen()}>
      <div class="absolute top-0 right-0 bottom-0 h-full overflow-y-auto w-[480px] bg-gradient-to-b from-black to-zinc-900/72 border-l border-stroke">
        <SongQueue />
      </div>
    </Show>
  );
};

export default MainScene;
