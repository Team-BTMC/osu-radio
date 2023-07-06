import { contextBridge, ipcRenderer } from 'electron';
import type { RequestAPI, APIListener, Packet, PacketType } from '../@types';
import { ListenAPI } from '../@types';



function createPacketPreload<T>(channel: string, token: string, data: T, type: PacketType = "DATA"): Packet<T> {
  return {
    channel, token, data, type
  }
}

const apiListeners = new Map<string, APIListener<any>[]>();

ipcRenderer.on("communication/renderer", async (_evt, packet: Packet<any>) => {
  const p = createPacketPreload(packet.channel, packet.token, undefined as any);
  const listeners = apiListeners.get(packet.channel);

  if (listeners === undefined) {
    p.type = "ERROR";
    p.reason = "No listeners found for channel: '" + packet.channel + "'";
    ipcRenderer.send("communication/main", p);
    return;
  }

  const responses: any[] = [];
  const promises: Promise<any>[] = [];

  for (let i = 0; i < listeners.length; i++) {
    try {
      const got = listeners[i](...packet.data);

      if (got instanceof Promise) {
        promises.push(got);
        got.then(x => {
          responses.push(x);
        });
        continue;
      }

      responses.push(got);
    } catch (e) {
      console.error(e);
      console.log(packet);
    }
  }

  await Promise.all(promises);
  p.data = responses;
  ipcRenderer.send("communication/main", p);
});

const api = {
  request<E extends keyof RequestAPI>(event: E, ...args: Parameters<RequestAPI[E]>): Promise<ReturnType<RequestAPI[E]>> {
    return ipcRenderer.invoke(event, ...args) as any;
  },

  listen<E extends keyof ListenAPI>(channel: E, listener: APIListener<ListenAPI[E]>): void {
    const entry = apiListeners.get(channel);

    if (entry === undefined) {
      apiListeners.set(channel, [listener]);
      return;
    }

    entry.push(listener);
  },

  removeListener<E extends keyof ListenAPI>(channel: E, listener: APIListener<ListenAPI[E]>): void {
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