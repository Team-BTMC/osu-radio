import { Router } from '../lib/route-pass/Router';
import { BrowserWindow } from 'electron';



let waitList: (()=>void)[] = [];

Router.respond("error::dismissed", () => {
  for (let i = 0; i < waitList.length; i++) {
    waitList[i]();
  }

  waitList = [];
});

export async function showError(window: BrowserWindow, msg: string): Promise<void> {
  await Router.dispatch(window, "changeScene", "error");
  await Router.dispatch(window, "error::setMessage", msg);

  return new Promise(resolve => {
    waitList.push(resolve);
  });
}