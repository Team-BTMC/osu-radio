import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { JSX, ParentComponent, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["div"];
export const TabsList: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["children", "class"]);
  const state = useTabs();
  return (
    <div {...state.attrs} {...rest} class={cn("flex rounded-xl bg-thin-material p-1", props.class)}>
      {props.children}
    </div>
  );
};
