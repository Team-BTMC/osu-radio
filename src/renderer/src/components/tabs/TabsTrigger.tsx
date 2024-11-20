import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { Component, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
  onSelectedByClick?: () => void;
};
const TabsTrigger: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "class"]);
  const { attrs, isSelected, tabIndex } = useTabs().item(props.value, {
    onSelectedByClick: props.onSelectedByClick,
  });
  return (
    <button
      data-selected={isSelected()}
      tabIndex={tabIndex()}
      {...attrs()}
      {...rest}
      class={cn(
        "ring-offset-background z-10 flex h-[33px] items-center gap-2 rounded-lg px-3 text-subtext transition-colors",
        props.class,
      )}
      classList={{
        "hover:bg-surface/15": !isSelected(),
      }}
    />
  );
};

export default TabsTrigger;
