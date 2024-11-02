import { cn } from "@renderer/lib/css.utils";
import { useList } from "./List";
import { Component, createMemo, Show, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { CheckIcon } from "lucide-solid";

export type Props = JSX.IntrinsicElements["button"] & {
  value?: string;
  onSelectedByClick?: () => void;
};
const ListItem: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "class", "children"]);

  const value = () => {
    return props.value ?? Math.random().toString(36);
  };

  const state = useList();
  const {
    attrs,
    isSelected: isFocused,
    tabIndex,
  } = state.item(value(), {
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
    <button
      class={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-stroke data-[selected=true]:bg-overlay/30 disabled:opacity-50 disabled:pointer-events-none",
        props.class,
      )}
      tabIndex={tabIndex()}
      data-selected={isFocused()}
      {...attrs}
      {...rest}
    >
      {props.children}

      <Show when={isSelected()}>
        <CheckIcon size={14} />
      </Show>
    </button>
  );
};

export default ListItem;
