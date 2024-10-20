import { useList } from "./List";
import { Component, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
  onSelectedByClick?: () => void;
};
const ListItem: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick"]);
  const { attrs, isSelected } = useList().item(props.value, {
    onSelectedByClick: props.onSelectedByClick,
  });
  return <button data-selected={isSelected()} {...attrs} {...rest} />;
};

export default ListItem;
