import { Router } from "@main/lib/route-pass/Router";
import { BrowserWindow } from "electron";

let pending: (() => void)[] = [];

Router.respond("error::dismissed", () => {
  // Error has been dismissed. Resolve all pending errors
  for (let i = 0; i < pending.length; i++) {
    pending[i]();
  }

  pending = [];
});

/**
 * Requests change of scenes to error scene and displays error message. Returned promise is resolved when user dismisses
 * the error.
 *
 * @param window
 * @param msg
 */
export async function showError(window: BrowserWindow, msg: string): Promise<void> {
  await Router.dispatch(window, "changeScene", "error");
  await Router.dispatch(window, "error::setMessage", msg);

  return new Promise((resolve) => {
    pending.push(resolve);
  });
}
