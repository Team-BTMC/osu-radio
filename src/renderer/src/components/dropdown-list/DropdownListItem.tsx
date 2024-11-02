import { useDropdownList } from "./DropdownList";
import { Component, onCleanup } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { RawList } from "../raw-list/RawList";

export type Props = JSX.IntrinsicElements["button"];
const DropdownListItem: Component<Props> = (props) => {
  const state = useDropdownList();
  const value = state.namespace.create();
  const { attrs, tabIndex, isSelected } = state.item(value, {
    onPointerMove: state.handleItemPointerMove,
  });

  onCleanup(() => {
    state.namespace.destroy(value);
  });

  return (
    <RawList.Item
      onPointerLeave={state.handleItemPointerLeave}
      tabIndex={tabIndex()}
      classList={{
        "bg-overlay/30": state.isHighlighted() && isSelected(),
      }}
      {...attrs}
      {...props}
    />
  );
};

export default DropdownListItem;
