import { Router } from '../lib/route-pass/Router';
import { BrowserWindow } from 'electron';
// import { TokenNamespace } from '../lib/tungsten/token';



let waitList: (()=>void)[] = [];

//todo Add IDs to request => during multiple

// const namespace = new TokenNamespace();

Router.respond("errorDismissed", () => {
  for (let i = 0; i < waitList.length; i++) {
    waitList[i]();
  }

  waitList = [];
});

export async function showError(window: BrowserWindow, msg: string): Promise<void> {
  await Router.dispatch(window, "changeScene", "error");
  await Router.dispatch(window, "errorSetMessage", msg);

  return new Promise(resolve => {
    waitList.push(resolve);
  });
}