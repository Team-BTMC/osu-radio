import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { Component, splitProps, createEffect } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
  onSelectedByClick?: () => void;
};
const TabsTrigger: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "class"]);
  const { attrs, isSelected, tabIndex, setActiveTabElement } = useTabs().item(props.value, {
    onSelectedByClick: props.onSelectedByClick,
  });
  let ref: HTMLButtonElement | undefined;

  createEffect(() => {
    if (isSelected() && ref) {
      setActiveTabElement(ref);
    }
  });

  return (
    <button
      ref={ref}
      data-selected={isSelected()}
      data-tab-value={props.value}
      tabIndex={tabIndex()}
      {...attrs}
      {...rest}
      class={cn(
        "ring-offset-background focus-visible:ring-ring relative z-10 flex h-8 items-center gap-2 rounded-lg px-3 text-subtext focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        props.class,
      )}
      classList={{
        "text-text": isSelected(),
      }}
    />
  );
};

export default TabsTrigger;
