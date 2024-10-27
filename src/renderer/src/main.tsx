import App from "./App";
import "@renderer/css/global.css";
import "@renderer/css/theme.css";
import { render } from "solid-js/web";

render(() => <App />, document.getElementById("root") as HTMLElement);
