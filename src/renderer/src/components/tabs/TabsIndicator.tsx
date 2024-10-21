import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { Component, createMemo } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type Props = JSX.IntrinsicElements["div"];
export const TabsIndicator: Component<Props> = (props) => {
  const state = useTabs();
  const style = createMemo((): JSX.CSSProperties => {
    const currentNode = state.currentlyActiveTab()?.getBoundingClientRect();
    if (!currentNode) {
      return {};
    }

    return {
      width: `${currentNode.width}px`,
      height: `${currentNode.height}px`,
      top: `${currentNode.top}px`,
      left: `${currentNode.left}px`,
    };
  });

  return (
    <div
      {...props}
      class={cn("fixed rounded-lg bg-surface transition-all", props.class)}
      style={style()}
    />
  );
};
