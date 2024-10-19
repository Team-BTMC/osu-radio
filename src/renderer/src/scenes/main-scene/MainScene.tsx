import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, setMainActiveTab, TABS } from "./main.utils";
import "./styles.css";
import Button from "@renderer/components/button/Button";
import Settings from "@renderer/components/settings/Settings";
import SongImage from "@renderer/components/song/SongImage";
import SongQueue from "@renderer/components/song/song-queue/SongQueue";
import { song } from "@renderer/components/song/song.utils";
import Tabs from "@renderer/components/tabs/Tabs";
import { Minimize2, Minus, Square, X } from "lucide-solid";
import { Accessor, Component, createEffect, createSignal, For, Setter } from "solid-js";

const MainScene: Component = () => {
  return (
    <Tabs value={mainActiveTab} onValueChange={setMainActiveTab}>
      <div class="main-scene flex h-screen flex-col overflow-hidden">
        <Nav />
        <main class="relative flex h-[calc(100vh-58px)]">
          <TabContent />
          <div class="flex flex-1 items-center justify-center">
            <SongDetail />
          </div>

          <QueueModal />
        </main>

        <div class="pointer-events-none absolute inset-0 z-[-1]">
          <SongImage
            src={song().bg}
            instantLoad={true}
            class="h-full w-full bg-cover blur-lg filter"
          />
        </div>
      </div>

      <div class="pointer-events-none absolute inset-0 z-[-1] bg-black/90" />
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
      class="flex h-[58px] items-center gap-4 bg-regular-material/50"
      style={os() === "darwin" ? { padding: "0px 0px 0px 95px" } : { padding: "0px 0px 0px 20px" }}
    >
      <Button size="icon" variant="ghost">
        <i class="ri-sidebar-fold-line"></i>
      </Button>
      <Tabs.List>
        <For each={Object.values(TABS)}>
          {({ label, value, icon }) => (
            <Tabs.Trigger value={value}>
              <i class={`${icon} ${mainActiveTab() === value ? "text-text" : "text-subtext"}`} />
              <span>{label}</span>
            </Tabs.Trigger>
          )}
        </For>
      </Tabs.List>

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
          <i class="ri-stack-fill" />
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

const TabContent: Component = () => {
  return (
    <div class="h-full w-[480px] min-w-[320px] overflow-y-auto bg-regular-material/50 shadow-2xl">
      <Tabs.Content value={TABS.SONGS.value}>
        <SongList isAllSongs={true} />
      </Tabs.Content>
      <Tabs.Content value={TABS.SETTINGS.value}>
        <Settings />
      </Tabs.Content>
      <Tabs.Content value={TABS.QUEUE.value}>
        <SongQueue />
      </Tabs.Content>
    </div>
  );
};

export default MainScene;
