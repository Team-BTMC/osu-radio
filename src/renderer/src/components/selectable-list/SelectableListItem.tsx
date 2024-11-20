import { RawList } from "../raw-list/RawList";
import { useSelectableList } from "./SelectableList";
import { CheckIcon } from "lucide-solid";
import { Component, createMemo, Show, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
  onSelectedByClick?: () => void;
};
const SelectableListItem: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "children"]);

  const state = useSelectableList();
  const { attrs, tabIndex } = state.item(props.value, {
    onSelectedByClick: () => {
      props.onSelectedByClick?.();
      if (!props.value) {
        return;
      }

      state.setSelectedItem(props.value);
    },
  });

  const isSelected = createMemo(() => {
    return state.selectedItem() === props.value;
  });

  return (
    <RawList.Item tabIndex={tabIndex()} {...attrs()} {...rest}>
      {props.children}
      <Show when={isSelected()}>
        <CheckIcon size={14} />
      </Show>
    </RawList.Item>
  );
};

export default SelectableListItem;
