import { Component } from 'solid-js';
import { clamp } from '../lib/tungsten/math';
import "../assets/css/bar.css";



export type BarAlignment = "vertical" | "v" | "horizontal" | "h";
const Bar: Component<{ alignment?: BarAlignment, filled: number }> = props => {
  return (
    <div
      class={'bar' + (props.alignment !== undefined ? ` ${props.alignment}` : "")}
      style={{ "--fill-per": clamp(0, 1, props.filled) }}
    >
      <div class="filling"></div>
    </div>
  );
}

export default Bar