import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { useList } from "./List";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
};
const ListItem: Component<Props> = (props) => {
  const state = useList();
  return (
    <button
      data-selected={state.selectedValue() === props.value}
      onClick={() => state.setSelectedValue(props.value)}
      {...props}
    />
  );
};

export default ListItem;
