import App from "./App";
import "@renderer/css/global.css";
import "@renderer/css/theme.css";
import { render } from "solid-js/web";
import { attachDevtoolsOverlay } from "@solid-devtools/overlay";

attachDevtoolsOverlay();

render(() => <App />, document.getElementById("root") as HTMLElement);
