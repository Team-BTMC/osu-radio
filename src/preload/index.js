import { contextBridge, ipcRenderer } from 'electron';
function createPacketPreload(channel, token, data, type = "DATA") {
    return {
        channel, token, data, type
    };
}
const apiListeners = new Map();
ipcRenderer.on("communication/renderer", async (_evt, packet) => {
    const p = createPacketPreload(packet.channel, packet.token, undefined);
    const listeners = apiListeners.get(packet.channel);
    if (listeners === undefined) {
        p.type = "ERROR";
        p.reason = "No listeners found for channel: '" + packet.channel + "'";
        ipcRenderer.send("communication/main", p);
        return;
    }
    const responses = [];
    const promises = [];
    for (let i = 0; i < listeners.length; i++) {
        const got = listeners[i](packet.data);
        if (got instanceof Promise) {
            promises.push(got);
            got.then(x => {
                responses.push(x);
            });
            continue;
        }
        responses.push(got);
    }
    await Promise.all(promises);
    p.data = responses;
    ipcRenderer.send("communication/main", p);
});
const api = {
    request(event, ...args) {
        return ipcRenderer.invoke(event, ...args);
    },
    listen(channel, listener) {
        const entry = apiListeners.get(channel);
        if (entry === undefined) {
            apiListeners.set(channel, [listener]);
            return;
        }
        entry.push(listener);
    },
    removeListener(channel, listener) {
        const entry = apiListeners.get(channel);
        if (entry == undefined) {
            return;
        }
        const i = entry.indexOf(listener);
        if (i === -1) {
            return;
        }
        entry.splice(i, 1);
    }
};
contextBridge.exposeInMainWorld('api', api);
