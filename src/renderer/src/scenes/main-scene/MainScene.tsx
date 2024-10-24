import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, NAV_ITEMS, setMainActiveTab, SIDEBAR_PAGES } from "./main.utils";
import "./styles.css";
import Button from "@renderer/components/button/Button";
import Settings from "@renderer/components/settings/Settings";
import SongImage from "@renderer/components/song/SongImage";
import { song } from "@renderer/components/song/song.utils";
import Tabs from "@renderer/components/tabs/Tabs";
import { Layers3Icon, MinusIcon, SettingsIcon, SidebarIcon, SquareIcon, XIcon } from "lucide-solid";
import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
  Setter,
  Show,
  JSX,
} from "solid-js";

const [os, setOs] = createSignal<NodeJS.Platform>();
const [active, setActive] = createSignal<boolean>(true);

const MainScene: Component = () => {
  onMount(async () => {
    const fetchOS = async () => {
      return await window.api.request("os::platform");
    };
    setOs(await fetchOS());
  });

  return (
    <Tabs value={mainActiveTab} onValueChange={setMainActiveTab}>
      <Show when={os() === "darwin"}>
        <div class="app-drag fixed left-0 top-0 h-16 w-screen" />
      </Show>
      <main
        class="main-scene relative h-screen"
        classList={{
          "windows-grid": os() === "win32",
          "mac-grid": os() === "darwin",
        }}
      >
        <Nav />
        <TabContent />

        <div
          class="song relative flex flex-1 items-center justify-center"
          classList={{
            "m-2 rounded-3xl": os() === "darwin",
            "mt-1 m-2": os() === "win32",
          }}
        >
          <SongDetail />
          <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-lg shadow-2xl ring-2 ring-inset ring-stroke">
            <SongImage
              src={song().bg}
              instantLoad={true}
              class="absolute inset-0 scale-110 bg-cover bg-fixed opacity-20 blur-lg filter"
            />
          </div>
          <Show when={os() === "darwin"}>
            <QueueIcon class="app-no-drag absolute right-2 top-2" />
          </Show>
        </div>
      </main>

      <div class="pointer-events-none absolute inset-0 z-[-1]">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="h-full w-full bg-cover blur-lg filter"
        />
      </div>

      <div class="pointer-events-none absolute inset-0 z-[-1] bg-black/90" />

      <Show when={os() === "darwin"}>
        <Button
          size="icon"
          variant="ghost"
          class="app-no-drag fixed left-[92px] top-[22px] z-20"
          onClick={() => setActive((a) => !a)}
        >
          <SidebarIcon />
        </Button>
      </Show>
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
    <div class="nav app-drag relative flex items-center">
      <nav
        class="absolute right-0 top-4 flex w-[480px] flex-1 flex-shrink-0 items-center"
        classList={{
          "pl-[124px]": os() === "darwin",
          "pl-4": os() !== "darwin",
        }}
      >
        <Show when={os() === "win32"}>
          <Button
            size="icon"
            variant="ghost"
            class="app-no-drag"
            onClick={() => setActive((a) => !a)}
          >
            <SidebarIcon />
          </Button>
        </Show>
        <Show when={typeof os() !== "undefined"}>
          <Tabs.List class="ml-3">
            <For each={NAV_ITEMS}>
              {({ label, value, Icon }) => (
                <Tabs.Trigger value={value} class="app-no-drag">
                  <Icon size={20} />
                  <span>{label}</span>
                </Tabs.Trigger>
              )}
            </For>
          </Tabs.List>
        </Show>

        <Button
          onClick={() => setMainActiveTab(SIDEBAR_PAGES.SETTINGS.value)}
          class="app-no-drag ml-auto"
          classList={{
            "mr-5": os() === "darwin",
          }}
          size="square"
          variant={mainActiveTab() === SIDEBAR_PAGES.SETTINGS.value ? "secondary" : "outlined"}
        >
          <SettingsIcon size={20} />
        </Button>

        <Show when={os() === "win32"}>
          <QueueIcon class="app-no-drag ml-2" />
        </Show>

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
    </div>
  );
};

const QueueIcon: Component<JSX.IntrinsicElements["button"]> = (props) => {
  return (
    <Button size="square" variant="outlined" {...props}>
      <Layers3Icon size={20} />
    </Button>
  );
};

function WindowControls(props: { maximized: Accessor<boolean>; setMaximized: Setter<boolean> }) {
  return (
    <div class="ml-4 mr-2 flex">
      <Button
        size="square"
        variant="ghost"
        onclick={async () => window.api.request("window::minimize")}
        class="nav-window-control app-no-drag"
      >
        <MinusIcon size={20} />
      </Button>
      <Button
        size="square"
        variant="ghost"
        onclick={async () => {
          window.api.request("window::maximize");
          props.setMaximized(!props.maximized());
        }}
        class="nav-window-control app-no-drag"
      >
        <SquareIcon size={18} />
      </Button>
      <Button
        size="square"
        variant="ghost"
        onclick={async () => window.api.request("window::close")}
        class="nav-window-control close app-no-drag"
      >
        <XIcon size={20} />
      </Button>
    </div>
  );
}

const TabContent: Component = () => {
  return (
    <div
      class="sidebar relative flex flex-col transition-all"
      classList={{
        "w-[480px]": active(),
        "w-0": !active(),
      }}
    >
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
