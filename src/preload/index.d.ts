import { ElectronAPI } from '@electron-toolkit/preload';
import { API } from '../@types';

declare global {
  interface Window {
    api: {
      request<E extends keyof API>(event: E, ...data: Parameters<API[E]>): Promise<ReturnType<API[E]>>,
      listen(channel: string, listener: APIListener<any, any>): void,
      removeListener(channel: string, listener: APIListener<any, any>): void,
    }
  }
}
