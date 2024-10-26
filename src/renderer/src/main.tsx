import App from "./App";
import "@renderer/assets/css/global.css";
import "@renderer/assets/css/theme.css";
import { render } from "solid-js/web";

render(() => <App />, document.getElementById("root") as HTMLElement);
