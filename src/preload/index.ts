import { contextBridge, ipcRenderer } from 'electron';
import type { API, APIListener, Packet, PacketType } from '../@types';



function createPacketPreload<T>(channel: string, token: string, data: T, type: PacketType = "DATA"): Packet<T> {
  return {
    channel, token, data, type
  }
}

const apiListeners = new Map<string, APIListener<any, any>[]>();

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
  request<E extends keyof API>(event: E, ...args: Parameters<API[E]>): Promise<ReturnType<API[E]>> {
    return ipcRenderer.invoke(event, ...args) as any;
  },

  listen(channel: string, listener: APIListener<any, any>): void {
    const entry = apiListeners.get(channel);

    if (entry === undefined) {
      apiListeners.set(channel, [listener]);
      return;
    }

    entry.push(listener);
  }
};

contextBridge.exposeInMainWorld('api', api);
