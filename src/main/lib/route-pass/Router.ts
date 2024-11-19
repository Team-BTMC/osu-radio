import { cratePacket } from "./Packet";
import { assertNever } from "@shared/lib/tungsten/assertNever";
import { TokenNamespace } from "@shared/lib/tungsten/token";
import type { APIFunction, Packet } from "@shared/types/common.types";
import { ListenAPI, RequestAPI } from "@shared/types/router.types";
import { BrowserWindow, ipcMain } from "electron";

type Pending = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  packet: Packet<any>;
};

const tokens = new TokenNamespace();
const pending: Pending[] = [];
ipcMain.on("communication/main", (_evt, packet: Packet<any>) => {
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
      default:
        assertNever(packet.type);
    }
  }
});

export class Router {
  /**
   * Client - Server - Client
   *
   * Respond to `event` that was dispatched from client and send data back to client. The data that are send is the
   * value returned from closure `fn`. Client may send data to server. The data is passed as arguments to closure `fn`
   *
   * Wrapper for `ipcMain.handle(...)`
   *
   * @param event
   * @param fn
   */
  static respond<E extends keyof RequestAPI>(event: E, fn: APIFunction<RequestAPI[E]>): void {
    ipcMain.handle(event, fn as any);
  }

  /**
   * Server - Client
   *
   * Send data to client. Provide client (`window`), `event`, and `data` that shall be delivered to client.
   *
   * @param window
   * @param channel
   * @param data
   * @returns {Promise<any>} The data the Promise is resolved with should be return value of client-side listener
   * function
   */
  static dispatch<E extends keyof ListenAPI>(
    window: BrowserWindow,
    channel: E,
    ...data: Parameters<ListenAPI[E]>
  ): Promise<any> {
    const packet = cratePacket(channel, tokens.create(), data);

    const promise = new Promise((resolve, reject) => {
      pending.push({
        packet,
        reject,
        resolve,
      });
    });

    if (window.isVisible()) {
      window.webContents.send("communication/renderer", packet);
    } else {
      window.on("ready-to-show", () => window.webContents.send("communication/renderer", packet));
    }

    return promise;
  }
}
