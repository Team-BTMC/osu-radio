import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { JSX, ParentComponent, splitProps, createEffect, createSignal } from "solid-js";

type Props = JSX.IntrinsicElements["div"];
export const TabsList: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["children", "class"]);
  const state = useTabs();
  const [indicatorStyle, setIndicatorStyle] = createSignal({});

  createEffect(() => {
    const activeTab = state.activeTabElement();
    if (activeTab) {
      setIndicatorStyle({
        width: `${activeTab.offsetWidth}px`,
        transform: `translateX(${activeTab.offsetLeft - 4}px)`,
      });
    }
  });

  return (
    <div
      {...state.attrs}
      {...rest}
      class={cn("relative flex rounded-xl bg-thin-material p-1", props.class)}
    >
      {props.children}
      <div
        class="absolute bottom-1 left-1 h-8 rounded-lg bg-surface transition-all duration-150"
        style={indicatorStyle()}
      />
    </div>
  );
};
