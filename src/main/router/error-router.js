import { Router } from '../lib/route-pass/Router';
let waitList = [];
Router.respond("errorDismissed", () => {
    for (let i = 0; i < waitList.length; i++) {
        waitList[i]();
    }
    waitList = [];
});
export async function showError(window, msg) {
    await Router.dispatch(window, "errorSetMessage", msg);
    return new Promise(resolve => {
        waitList.push(resolve);
    });
}
