import "../assets/css/gradient.css";
import Impulse from "../lib/Impulse";
import { Component, createEffect, createSignal, JSXElement, onCleanup, onMount } from "solid-js";

export type GradientColors = {
  top: string;
  bottom: string;
};

export const [gradientColors, setGradientColors] = createSignal<GradientColors>({
  top: "dodgerblue",
  bottom: "crimson",
});

type GradientProps = {
  classTop?: string;
  classBottom?: string;
  update?: Impulse;
  children: JSXElement;
};

const Gradient: Component<GradientProps> = (props) => {
  let bottomLayer: HTMLDivElement | undefined;

  const calculateBackground = () => {
    if (!bottomLayer) {
      return;
    }

    const rect: DOMRect = bottomLayer.getBoundingClientRect();

    bottomLayer.style.setProperty("--left", `${Math.round(-rect.left)}px`);
    bottomLayer.style.setProperty("--top", `${Math.round(-rect.top)}px`);

    bottomLayer.style.setProperty("--right", `${Math.round(rect.left + rect.width)}px`);
    bottomLayer.style.setProperty("--bottom", `${Math.round(rect.top + rect.height)}px`);

    bottomLayer.style.setProperty("--width", `${Math.round(window.innerWidth * 1.25)}px`);
    bottomLayer.style.setProperty("--height", `${Math.round(window.innerHeight * 1.25)}px`);
  };

  if (props.update !== undefined) {
    props.update.listen(calculateBackground);
  }

  onMount(() => {
    calculateBackground();
    window.addEventListener("resize", calculateBackground);
  });

  onCleanup(() => {
    window.removeEventListener("resize", calculateBackground);
  });

  createEffect(() => {
    const colors = gradientColors();

    document.documentElement.style.setProperty("--circle-0", colors.top);
    document.documentElement.style.setProperty("--circle-1", colors.bottom);
  });

  return (
    <div ref={bottomLayer} class={`bottom-layer ${props.classBottom ?? ""}`}>
      <div class={`gradient-layer`}>
        <div class={`top-layer ${props.classTop ?? ""}`}>{props.children}</div>
      </div>
    </div>
  );
};

export default Gradient;
