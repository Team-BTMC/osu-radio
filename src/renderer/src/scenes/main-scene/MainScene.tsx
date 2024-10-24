import SongDetail from "../../components/song/song-detail/SongDetail";
import SongList from "../../components/song/song-list/SongList";
import { mainActiveTab, setMainActiveTab, Tab, TABS } from "./main.utils";
import "./styles.css";
import Button from "@renderer/components/button/Button";
import NoticeContainer from "@renderer/components/notice/NoticeContainer";
import Settings from "@renderer/components/settings/Settings";
import SongImage from "@renderer/components/song/SongImage";
import SongQueue from "@renderer/components/song/song-queue/SongQueue";
import {
  songQueueModalOpen,
  toggleSongQueueModalOpen,
} from "@renderer/components/song/song-queue/song-queue.utils";
import { song } from "@renderer/components/song/song.utils";
import { LayersIcon, Minimize2Icon, MinusIcon, SquareIcon, XIcon } from "lucide-solid";
import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  JSXElement,
  Match,
  onCleanup,
  onMount,
  Setter,
  Show,
  Switch,
} from "solid-js";

const MainScene: Component = () => {
  return (
    <div class="main-scene flex h-screen flex-col overflow-hidden">
      <NoticeContainer />
      <Nav />
      <main class="relative flex h-[calc(100vh-52px)]">
        <TabContent />
        <div class="flex flex-1 items-center justify-center song-detail-gradient">
          <SongDetail />
        </div>
        <QueueModal />
      </main>

      <div class="pointer-events-none absolute inset-0 z-[-1] opacity-[0.12]">
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

  onMount(async () => {
    const fetchOS = async () => {
      return await window.api.request("os::platform");
    };

    const fetchMaximized = async () => {
      return await window.api.request("window::isMaximized");
    };

    setOs(await fetchOS());
    setMaximized(await fetchMaximized());
  });

  createEffect(() => {
    const resizeListener = (maximized: boolean) => {
      setMaximized(maximized);
    };

    window.api.listen("window::maximizeChange", resizeListener);
    return () => {
      window.api.removeListener("window::maximizeChange", resizeListener);
    };
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
          <LayersIcon size={20} />
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
        onClick={async () => window.api.request("window::minimize")}
        class="nav-window-control"
      >
        <MinusIcon size={20} />
      </button>
      <button
        onClick={async () => {
          window.api.request("window::maximize");
          props.setMaximized(!props.maximized());
        }}
        class="nav-window-control"
      >
        {props.maximized() ? <Minimize2Icon size={20} /> : <SquareIcon size={18} />}
      </button>
      <button
        onClick={async () => window.api.request("window::close")}
        class="nav-window-control close"
      >
        <XIcon size={20} />
      </button>
    </div>
  );
}

type NavItemProps = Pick<Tab, "value" | "Icon"> & {
  children: JSXElement;
};
const NavItem: Component<NavItemProps> = (props) => {
  return (
    <button
      class={`nav-item flex items-center gap-4 rounded-sm px-4 py-1 hover:bg-surface ${mainActiveTab() === props.value ? "bg-surface" : ""}`}
      onClick={() => setMainActiveTab(props.value)}
    >
      <span class={`${mainActiveTab() === props.value ? "" : "opacity-70"}`}>
        <props.Icon size={20} />
      </span>
      <span
        class={`text-base font-semibold ${mainActiveTab() === props.value ? "text-text" : "text-subtext"}`}
      >
        {props.children}
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
    if (queueModal && !queueModal.contains(event.target as Node)) {
      toggleSongQueueModalOpen();
    }
  };

  createEffect(() => {
    if (songQueueModalOpen()) {
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
