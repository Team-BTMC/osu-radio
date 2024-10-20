import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, NAV_ITEMS, setMainActiveTab, SIDEBAR_PAGES } from "./main.utils";
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
import { Accessor, Component, createEffect, createSignal, For, Setter, Show } from "solid-js";

const MainScene: Component = () => {
  return (
    <Tabs value={mainActiveTab} onValueChange={setMainActiveTab}>
      <main class="relative flex h-screen">
        <TabContent />
        <div class="relative my-3 mr-3 flex flex-1 items-center justify-center rounded">
          <SongDetail />

          <Button
            size="square"
            class="absolute right-2 top-2 z-10 flex items-center gap-2"
            variant="outlined"
          >
            <Layers3Icon size={20} />
          </Button>

          <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-lg bg-fixed">
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
      class="flex h-[64px] flex-shrink-0 items-center gap-4"
      classList={{
        "pl-[92px]": os() === "darwin",
        "pl-4": os() !== "darwin",
      }}
    >
      <Button size="icon" variant="ghost">
        <SidebarIcon />
      </Button>
      <Show when={typeof os() !== "undefined"}>
        <Tabs.List>
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
        class="ml-auto mr-5"
        size="square"
        variant={mainActiveTab() === SIDEBAR_PAGES.SETTINGS.value ? "secondary" : "outlined"}
      >
        <SettingsIcon size={20} />
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
    <div class="nav-window-controls">
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
    <div class="flex w-[480px] min-w-[320px] flex-col shadow-2xl">
      <Nav />
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
