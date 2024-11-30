import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { createMemo, JSX, onMount, ParentComponent, splitProps } from "solid-js";

type Props = JSX.IntrinsicElements["div"];
export const TabsList: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["children", "class"]);
  const state = useTabs();

  onMount(state.onListmounted);

  const hasSelectedValue = createMemo(() => {
    return state.registeredTabs().includes(state.value());
  });

  return (
    <div
      {...state.attrs}
      {...rest}
      tabIndex={hasSelectedValue() ? -1 : 0}
      onFocus={(event) => {
        if (!event.currentTarget.isSameNode(event.target)) {
          return;
        }

        state.tryFocusFirstItem();
      }}
      class={cn(
        "relative flex gap-1 rounded-xl bg-thin-material p-1 ring-1 ring-stroke",
        props.class,
      )}
    >
      {props.children}
    </div>
  );
};
