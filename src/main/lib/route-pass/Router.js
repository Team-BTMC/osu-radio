import { ipcMain } from 'electron';
import { TokenNamespace } from '../tungsten/token';
import { assertNever } from '../tungsten/assertNever';
import { cratePacket } from './Packet';
const tokens = new TokenNamespace();
const pending = [];
ipcMain.on("communication/main", (_evt, packet) => {
    for (let i = 0; i < pending.length; i++) {
        if (pending[i].packet.token !== packet.token) {
            continue;
        }
        switch (packet.type) {
            case "DATA": {
                pending[i].resolve(packet.data);
                break;
            }
            case "ERROR": {
                pending[i].reject(packet.reason);
                break;
            }
            default: assertNever(packet.type);
        }
    }
});
export class Router {
    static respond(event, fn) {
        ipcMain.handle(event, fn);
    }
    static dispatch(window, channel, data) {
        const packet = cratePacket(channel, tokens.create(), data);
        const promise = new Promise((resolve, reject) => {
            pending.push({
                packet,
                reject,
                resolve
            });
        });
        if (window.isVisible()) {
            window.webContents.send("communication/renderer", packet);
        }
        else {
            window.on("ready-to-show", () => window.webContents.send("communication/renderer", packet));
        }
        return promise;
    }
}
