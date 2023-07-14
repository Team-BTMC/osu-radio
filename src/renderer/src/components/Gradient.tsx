import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import "../assets/css/gradient.css";



export type GradientColors = {
  top: string,
  bottom: string,
}

export const [gradientColors, setGradientColors] = createSignal<GradientColors>({
  top: "dodgerblue",
  bottom: "crimson"
});



const Gradient: Component<{ class?: string, children }> = (props) => {
  createEffect(() => {
    const colors = gradientColors();

    document.documentElement.style.setProperty('--circle-0', colors.top);
    document.documentElement.style.setProperty('--circle-1', colors.bottom);
  });

  let bottomLayer;

  const onResize = () => {
    const rect: DOMRect = bottomLayer.getBoundingClientRect();

    bottomLayer.style.setProperty("--left", `${Math.round(-rect.left)}px`);
    bottomLayer.style.setProperty("--top", `${Math.round(-rect.top)}px`);

    bottomLayer.style.setProperty("--right", `${Math.round(rect.left + rect.width)}px`);
    bottomLayer.style.setProperty("--bottom", `${Math.round(rect.top + rect.height)}px`);

    bottomLayer.style.setProperty("--width", `${Math.round(window.innerWidth * 1.25)}px`);
    bottomLayer.style.setProperty("--height", `${Math.round(window.innerHeight * 1.25)}px`);
  }

  onMount(() => {
    onResize();
    window.addEventListener("resize", onResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", onResize);
  });

  return (
    <div ref={bottomLayer} class={"bottom-layer"}>
      <div class={`gradient-layer`}>
        <div class={`top-layer ${props.class ?? ""}`}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Gradient;
