import type { RequestAPI, APIFunction, ListenAPI } from '../../../@types';
import { BrowserWindow } from 'electron';
export declare class Router {
    static respond<E extends keyof RequestAPI>(event: E, fn: APIFunction<RequestAPI[E]>): void;
    static dispatch<E extends keyof ListenAPI>(window: BrowserWindow, channel: E, ...data: Parameters<ListenAPI[E]>): Promise<any>;
}
