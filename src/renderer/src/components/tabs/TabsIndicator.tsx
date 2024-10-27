import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { Component, createMemo } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type Props = JSX.IntrinsicElements["div"];
export const TabsIndicator: Component<Props> = (props) => {
  const state = useTabs();
  const style = createMemo((): JSX.CSSProperties => {
    const activeElement = state.currentlyActiveElement();
    if (typeof activeElement === "undefined") {
      return {};
    }

    const { width, height } = activeElement.getBoundingClientRect();
    return {
      position: "absolute",
      "transition-property": "left, width, height",
      top: `${activeElement.offsetTop}px`,
      left: `${activeElement.offsetLeft}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  });

  return (
    <div
      {...props}
      class={cn("fixed rounded-lg bg-surface transition", props.class)}
      style={style()}
    />
  );
};
