import App from "./App";
import "@renderer/css/global.css";
import "@renderer/css/theme.css";
import { attachDevtoolsOverlay } from "@solid-devtools/overlay";
import { render } from "solid-js/web";

if (import.meta.env.VITE_SOLID_DEVTOOLS !== "false") {
  attachDevtoolsOverlay();
}

render(() => <App />, document.getElementById("root") as HTMLElement);
