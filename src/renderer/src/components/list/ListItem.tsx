import { cn } from "@renderer/lib/css.utils";
import { useList } from "./List";
import { Component, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
  onSelectedByClick?: () => void;
};
const ListItem: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "class"]);
  const { attrs, isSelected } = useList().item(props.value, {
    onSelectedByClick: props.onSelectedByClick,
  });
  return (
    <button
      class={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-stroke data-[selected=true]:bg-overlay/30",
        props.class,
      )}
      data-selected={isSelected()}
      {...attrs}
      {...rest}
    />
  );
};

export default ListItem;
