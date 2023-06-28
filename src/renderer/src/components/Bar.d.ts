import { Component } from 'solid-js';
import "../assets/css/bar.css";
export type BarAlignment = "vertical" | "v" | "horizontal" | "h";
declare const Bar: Component<{
    alignment?: BarAlignment;
    filled: number;
}>;
export default Bar;
