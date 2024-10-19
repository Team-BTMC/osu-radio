import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, setMainActiveTab, Tab, TABS } from "./main.utils";
import "./styles.css";
import Button from "@renderer/components/button/Button";
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
    <div class="main-scene flex h-screen flex-col overflow-hidden">
      <Nav />
      <main class="relative flex h-[calc(100vh-52px)]">
        <TabContent />
        <div class="flex flex-1 items-center justify-center">
          <SongDetail />
        </div>

        <QueueModal />
      </main>

      <div class="pointer-events-none absolute inset-0 z-[-1] opacity-[0.072]">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="h-full w-full bg-cover blur-xl filter"
        />
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
      style={os() === "darwin" ? { padding: "0px 0px 0px 95px" } : { padding: "0px 0px 0px 20px" }}
    >
      <For each={Object.values(TABS)}>
        {({ label, ...rest }) => <NavItem {...rest}>{label}</NavItem>}
      </For>

      <div class="nav__queue ml-auto">
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
      class={`nav-item flex items-center gap-4 rounded-sm px-4 py-1 hover:bg-surface ${mainActiveTab() === value ? "bg-surface" : ""}`}
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
    <div class="h-full w-[480px] min-w-[320px] overflow-y-auto border-r border-stroke/10 bg-regular-material shadow-2xl">
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

  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      if (
        queueModal &&
        !queueModal.contains(event.target as Node) &&
        event.target.closest(".popover-overlay") === null
      ) {
        toggleSongQueueModalOpen();
      }
    }
  };

  createEffect(() => {
    if (songQueueModalOpen()) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    onCleanup(() => {
      document.removeEventListener("click", handleOutsideClick);
    });
  });

  return (
    <Show when={songQueueModalOpen()}>
      <div
        class="queue-modal absolute bottom-0 right-0 top-0 z-20 h-full w-[480px] overflow-y-auto border-l border-stroke shadow-2xl"
        ref={queueModal}
      >
        <SongQueue />
      </div>
    </Show>
  );
};

export default MainScene;
