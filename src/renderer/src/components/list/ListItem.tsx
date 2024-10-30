import { cn } from "@renderer/lib/css.utils";
import { useList } from "./List";
import { Component, createMemo, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value?: string;
  onSelectedByClick?: () => void;
};
const ListItem: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "class"]);

  const value = createMemo(() => {
    return props.value ?? Math.random().toString(36);
  });

  const { attrs, isSelected, tabIndex } = useList().item(value(), {
    onSelectedByClick: props.onSelectedByClick,
  });
  return (
    <button
      class={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-stroke data-[selected=true]:bg-overlay/30 disabled:opacity-50 disabled:pointer-events-none",
        props.class,
      )}
      tabIndex={tabIndex()}
      data-selected={isSelected()}
      {...attrs}
      {...rest}
    />
  );
};

export default ListItem;
