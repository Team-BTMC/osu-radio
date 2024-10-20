import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, NAV_ITEMS, setMainActiveTab, SIDEBAR_PAGES } from "./main.utils";
import "./styles.css";
import Button from "@renderer/components/button/Button";
import Settings from "@renderer/components/settings/Settings";
import SongImage from "@renderer/components/song/SongImage";
import { song } from "@renderer/components/song/song.utils";
import Tabs from "@renderer/components/tabs/Tabs";
import {
  Layers3Icon,
  Minimize2Icon,
  MinusIcon,
  SettingsIcon,
  SidebarIcon,
  SquareIcon,
  XIcon,
} from "lucide-solid";
import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
  Setter,
  Show,
} from "solid-js";

const [os, setOs] = createSignal<NodeJS.Platform>();

const MainScene: Component = () => {
  onMount(async () => {
    const fetchOS = async () => {
      return await window.api.request("os::platform");
    };
    setOs(await fetchOS());
  });

  return (
    <Tabs value={mainActiveTab} onValueChange={setMainActiveTab}>
      <main
        class="main-scene relative h-screen"
        classList={{
          "windows-grid": os() === "win32",
          "mac-grid": os() === "darwin",
        }}
      >
        <Nav />
        <TabContent />
        <div class="song relative mb-4 mr-4 mt-2 flex flex-1 items-center justify-center">
          <SongDetail />
          <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-fixed">
            <SongImage
              src={song().bg}
              instantLoad={true}
              class="h-full w-full bg-cover bg-fixed opacity-20 filter"
            />
            <div class="pointer-events-none absolute inset-0 bg-black/20 backdrop-blur-lg" />
          </div>
        </div>
      </main>

      <div class="pointer-events-none absolute inset-0 z-[-1]">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="h-full w-full bg-cover blur-lg filter"
        />
      </div>

      <div class="pointer-events-none absolute inset-0 z-[-1] bg-black/80" />
    </Tabs>
  );
};

const Nav: Component = () => {
  const [maximized, setMaximized] = createSignal<boolean>(false);

  createEffect(async () => {
    const fetchMaximized = async () => {
      return await window.api.request("window::isMaximized");
    };

    setMaximized(await fetchMaximized());
    window.api.listen("window::maximizeChange", (maximized: boolean) => {
      setMaximized(maximized);
    });
  });

  return (
    <nav
      class="nav flex flex-shrink-0 items-center"
      classList={{
        "pl-[92px]": os() === "darwin",
        "pl-4": os() !== "darwin",
      }}
    >
      <Button size="icon" variant="ghost">
        <SidebarIcon />
      </Button>
      <Show when={typeof os() !== "undefined"}>
        <Tabs.List class="ml-4">
          <For each={NAV_ITEMS}>
            {({ label, value, Icon }) => (
              <Tabs.Trigger value={value}>
                <Icon size={20} />
                <span>{label}</span>
              </Tabs.Trigger>
            )}
          </For>
        </Tabs.List>
      </Show>

      <Button
        onClick={() => setMainActiveTab(SIDEBAR_PAGES.SETTINGS.value)}
        class="ml-auto"
        size="square"
        variant={mainActiveTab() === SIDEBAR_PAGES.SETTINGS.value ? "secondary" : "outlined"}
      >
        <SettingsIcon size={20} />
      </Button>

      <Button size="square" variant="outlined">
        <Layers3Icon size={20} />
      </Button>

      {/* <div class="nav__queue ml-auto">
        <Button
          variant="ghost"
          size="icon"
          classList={{
            "text-text": songQueueModalOpen(),
          }}
          class="mr-2"
          onClick={toggleSongQueueModalOpen}
        >
          <LayersIcon size={20} />
        </Button>
      </div> */}
      {os() !== "darwin" && <WindowControls maximized={maximized} setMaximized={setMaximized} />}
    </nav>
  );
};

function WindowControls(props: { maximized: Accessor<boolean>; setMaximized: Setter<boolean> }) {
  return (
    <div>
      <button
        onclick={async () => window.api.request("window::minimize")}
        class="nav-window-control"
      >
        <MinusIcon size={20} />
      </button>
      <button
        onclick={async () => {
          window.api.request("window::maximize");
          props.setMaximized(!props.maximized());
        }}
        class="nav-window-control"
      >
        {props.maximized() ? <Minimize2Icon size={20} /> : <SquareIcon size={18} />}
      </button>
      <button
        onclick={async () => window.api.request("window::close")}
        class="nav-window-control close"
      >
        <XIcon size={20} />
      </button>
    </div>
  );
}

const TabContent: Component = () => {
  return (
    <div class="sidebar flex w-[480px] min-w-[320px] flex-col shadow-2xl">
      <SongList isAllSongs={true} />

      {/* <Tabs.Content value={TABS.SETTINGS.value}>
        <Settings />
      </Tabs.Content> */}
      <Tabs.Content value={SIDEBAR_PAGES.SETTINGS.value}>
        <Settings />
      </Tabs.Content>
      {/* <SongQueue /> */}
    </div>
  );
};

export default MainScene;
