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
import { Minimize2, Minus, Square, X } from "lucide-solid";
import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  JSXElement,
  Match,
  onCleanup,
  Setter,
  Show,
  Switch,
} from "solid-js";

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
  const [os, setOs] = createSignal<NodeJS.Platform>();
  const [maximized, setMaximized] = createSignal<boolean>(false);

  createEffect(async () => {
    const fetchOS = async () => {
      return await window.api.request("os::platform");
    };

    const fetchMaximized = async () => {
      return await window.api.request("window::isMaximized");
    };

    setOs(await fetchOS());
    setMaximized(await fetchMaximized());

    window.api.listen("window::maximizeChange", (maximized: boolean) => {
      setMaximized(maximized);
    });
  });

  return (
    <nav
      class="nav"
      style={os() === "darwin" ? { padding: "0px 20px 0px 95px" } : { padding: "0px 0px 0px 20px" }}
    >
      <For each={Object.values(TABS)}>
        {({ label, ...rest }) => <NavItem {...rest}>{label}</NavItem>}
      </For>

      <div class="nav__queue">
        <IconButton data-active={songQueueModalOpen()} onClick={toggleSongQueueModalOpen}>
          <i class="ri-stack-fill nav__queue-icon" />
        </IconButton>
      </div>
      {os() !== "darwin" && <WindowControls maximized={maximized} setMaximized={setMaximized} />}
    </nav>
  );
};

function WindowControls(props: { maximized: Accessor<boolean>; setMaximized: Setter<boolean> }) {
  return (
    <div class="nav-window-controls">
      <button
        onclick={async () => window.api.request("window::minimize")}
        class="nav-window-control"
      >
        <Minus size={20} />
      </button>
      <button
        onclick={async () => {
          window.api.request("window::maximize");
          props.setMaximized(!props.maximized());
        }}
        class="nav-window-control"
      >
        {props.maximized() ? <Minimize2 size={20} /> : <Square size={18} />}
      </button>
      <button
        onclick={async () => window.api.request("window::close")}
        class="nav-window-control close"
      >
        <X size={20} />
      </button>
    </div>
  );
}

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
        <Match when={mainActiveTab() === TABS.SETTINGS.value}>
          <Settings />
        </Match>
      </Switch>
    </div>
  );
};

const QueueModal: Component = () => {
  let queueModal: HTMLDivElement | undefined;
  const [, setClickedOutside] = createSignal(false);

  const handleOutsideClick = (event: MouseEvent) => {
    if (queueModal && !queueModal.contains(event.target as Node)) {
      setClickedOutside(true);
      toggleSongQueueModalOpen();
    }
  };

  createEffect(() => {
    if (songQueueModalOpen()) {
      setClickedOutside(false);
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    onCleanup(() => {
      document.removeEventListener("mousedown", handleOutsideClick);
    });
  });

  return (
    <Show when={songQueueModalOpen()}>
      <div class="queue-modal" ref={queueModal}>
        <SongQueue />
      </div>
    </Show>
  );
};

export default MainScene;
