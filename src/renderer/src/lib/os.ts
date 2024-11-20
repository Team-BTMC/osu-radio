import { createSignal } from "solid-js";

export const [os, setOs] = createSignal<NodeJS.Platform>();

export const fetchOs = async () => {
  return await window.api.request("os::platform");
};
