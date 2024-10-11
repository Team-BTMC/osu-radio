import PlaylistView from "@renderer/components/playlist/playlist-view/PlaylistView";
import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, setMainActiveTab, Tab, TABS } from "./main.utils";
import "./styles.css";
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
    <div class="main-scene">
      <Nav />
      <main class="main-scene__main">
        <TabContent />
        <div class="main-scene__song-detail">
          <SongDetail />
        </div>

        <QueueModal />
      </main>

      <div class="main-scene__bg-image">
        <SongImage src={song().bg} instantLoad={true} />
      </div>
    </div>
  );
};

const Nav: Component = () => {
  return (
    <nav class="nav">
      <For each={Object.values(TABS)}>
        {({ label, ...rest }) => <NavItem {...rest}>{label}</NavItem>}
      </For>

      <div class="nav__queue">
        <IconButton data-active={songQueueModalOpen()} onClick={toggleSongQueueModalOpen}>
          <i class="ri-stack-fill nav__queue-icon" />
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
      class="nav-item"
      data-selected={mainActiveTab() === value}
      onclick={() => setMainActiveTab(value)}
    >
      <i class={`nav-item__icon ${icon}`} />
      <span class="nav-item__text">{children}</span>
    </button>
  );
};

const TabContent: Component = () => {
  return (
    <div class="tab-content">
      <Switch fallback={<div>Tab not found</div>}>
        <Match when={mainActiveTab() === TABS.SONGS.value}>
          <SongList isAllSongs={true} />
        </Match>
        <Match when={mainActiveTab() === TABS.PLAYLISTS.value}>
          <PlaylistView />
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
      <div class="queue-modal">
        <SongQueue />
      </div>
    </Show>
  );
};

export default MainScene;
