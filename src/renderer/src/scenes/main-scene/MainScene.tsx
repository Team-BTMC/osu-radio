import SongDetail from "../../components/song/song-detail/SongDetail";
import "./styles.css";
import Button from "@renderer/components/button/Button";
import SongImage from "@renderer/components/song/SongImage";
import { song } from "@renderer/components/song/song.utils";
import { WindowsControls } from "@renderer/components/windows-control/WindowsControl";
import { os } from "@renderer/lib/os";
import { Layers3Icon } from "lucide-solid";
import { Component, createSignal, Match, Switch } from "solid-js";
import { Sidebar } from "./Sidebar";
import Popover from "@renderer/components/popover/Popover";
import SongQueue from "@renderer/components/song/song-queue/SongQueue";

const MainScene: Component = () => {
  return (
    <div class="min-h-screen h-full flex flex-col">
      <Switch>
        <Match when={os() === "darwin"}>
          <MacNav />
        </Match>
        <Match when={os() !== "darwin"}>
          <WindownsNav />
        </Match>
      </Switch>

      <main class="main-scene relative flex-1 app-grid">
        <Sidebar />

        <div
          class="song relative flex flex-1 items-center justify-center"
          classList={{
            "m-2 rounded-3xl": os() === "darwin",
            "mt-0 m-2": os() !== "darwin",
          }}
        >
          <SongDetail />
          <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-lg shadow-2xl ring-2 ring-inset ring-stroke">
            <SongImage
              src={song().bg}
              instantLoad={true}
              class="absolute inset-0 bg-cover bg-fixed bg-left-top opacity-30 blur-lg filter"
            />
          </div>
          <Queue />
        </div>
      </main>

      <div class="pointer-events-none fixed h-full inset-0 z-[-1]">
        <SongImage
          src={song().bg}
          instantLoad={true}
          class="h-full w-full bg-cover bg-fixed bg-center blur-lg filter"
        />
      </div>

      <div class="pointer-events-none fixed h-full inset-0 z-[-1] bg-black/80" />
    </div>
  );
};

const Queue: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Popover
      placement="bottom-end"
      offset={{
        mainAxis: 8,
      }}
      onValueChange={setIsOpen}
      isOpen={isOpen}
    >
      <Popover.Anchor onClick={() => setIsOpen(true)} class="no-drag absolute right-2 top-2">
        <Button size="square" variant="outlined" class="no-drag">
          <Layers3Icon size={20} />
        </Button>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content class="w-[480px] max-h-[600px] flex p-0">
          <SongQueue />
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

const MacNav: Component = () => {
  return <nav class="drag fixed left-0 top-0 h-16 w-screen hover:bg-subtext" />;
};

const WindownsNav: Component = () => {
  return (
    <nav class="nav drag relative flex items-center justify-end">
      <WindowsControls />
    </nav>
  );
};

export default MainScene;
