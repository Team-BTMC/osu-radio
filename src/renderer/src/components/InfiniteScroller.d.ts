import { Component, JSX } from 'solid-js';
import { OmitPropsWithoutReturnType, Optional, RequestAPI } from '../../../@types';
import ResetSignal from '../lib/ResetSignal';
export type InfiniteScrollerResponse = Optional<{
    index: number;
    items: any[];
}>;
type InfinityScrollerProps = {
    apiKey: keyof OmitPropsWithoutReturnType<RequestAPI, InfiniteScrollerResponse>;
    component: Component;
    reset?: ResetSignal;
    autoload?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement>;
declare const InfiniteScroller: Component<InfinityScrollerProps>;
export default InfiniteScroller;
