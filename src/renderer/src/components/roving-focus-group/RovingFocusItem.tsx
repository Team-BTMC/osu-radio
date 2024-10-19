import { useRovingFocus } from "./RovingFocusGroup";
import { createMemo, JSX, ParentComponent, splitProps } from "solid-js";

export type Props = JSX.IntrinsicElements["button"] & {
  tabStopId: string;
  onSelectedValueChange(tabStopId: string): void;
};
export const RovingFocusItem: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, [
    "tabStopId",
    "children",
    "onClick",
    "onFocus",
    "onSelectedValueChange",
  ]);

  const state = useRovingFocus();
  const isCurrentTabStop = createMemo(() => {
    return state.currentTabStopId() === props.tabStopId;
  });

  return (
    <button
      {...rest}
      tabIndex={isCurrentTabStop() ? 0 : -1}
      onClick={() => {
        state.onItemFocus(props.tabStopId);
        props.onSelectedValueChange(props.tabStopId);
      }}
      onFocus={() => {
        state.onItemFocus(props.tabStopId);
        props.onSelectedValueChange(props.tabStopId);
      }}
      onKeyDown={(e) => {}}
    >
      {props.children}
    </button>
  );
};
