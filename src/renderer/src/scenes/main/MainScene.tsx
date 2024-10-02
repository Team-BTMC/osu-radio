import SongList from "../../components/song/song-list/SongList";
import { Component, For, JSXElement, Match, Show, Switch } from "solid-js";
import Fa from "solid-fa";
import { faList } from "@fortawesome/free-solid-svg-icons";
import SongDetail from "../../components/song/song-detail/SongDetail";
import SongImage from "@renderer/components/song/SongImage";
import { mainActiveTab, setMainActiveTab, Tab, TABS } from "@renderer/lib/state/main-tabs";
import IconButton from "@renderer/components/icon-button/IconButton";
import SongQueue from "@renderer/components/song/song-queue/SongQueue";
import { songQueueModalOpen, toggleSongQueueModalOpen } from "@renderer/lib/state/queue";
import { song } from "@renderer/lib/state/song";
import Settings from "@renderer/components/settings/Settings";
import "./styles.css";

const MainScene: Component = () => {
  return (
    <div class="default-layout">
      <Nav />
      <main class="default-layout__main">
        <TabContent />
        <div class="default-layout__song-detail">
          <SongDetail />
        </div>

        <QueueModal />
      </main>

      <div class="default-layout__bg-image">
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

      <IconButton
        class="nav__queue"
        data-active={songQueueModalOpen()}
        onClick={toggleSongQueueModalOpen}
      >
        <Fa icon={faList} class="nav__queue-icon" />
      </IconButton>
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
      <Fa class="nav-item__icon" icon={icon} />
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
