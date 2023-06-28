import type { API, APIFunction } from '../../../@types';
import { BrowserWindow } from 'electron';
export declare class Router {
    static respond<E extends keyof API>(event: E, fn: APIFunction<API[E]>): void;
    static dispatch(window: BrowserWindow, channel: string, data: any): Promise<any>;
}
