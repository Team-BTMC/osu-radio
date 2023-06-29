import { Router } from '../lib/route-pass/Router';
import { none, some } from '../lib/rust-like-utils-backend/Optional';
import { dialog } from 'electron';
let waitList = [];
Router.respond("dirSelect", () => {
    const path = dialog.showOpenDialogSync({
        title: "Select your osu! Songs folder",
        properties: ["openDirectory"]
    });
    if (path === undefined) {
        return none();
    }
    return some(path[0]);
});
Router.respond("dirSubmit", (_evt, dir) => {
    for (let i = 0; i < waitList.length; i++) {
        waitList[i](dir);
    }
    waitList = [];
});
export function dirSubmit() {
    return new Promise(resolve => {
        waitList.push(resolve);
    });
}
