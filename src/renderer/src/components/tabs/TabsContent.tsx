import { useTabs } from "./Tabs";
import { createMemo, ParentComponent, Show } from "solid-js";

export type Props = {
  value: string;
};
export const TabsContent: ParentComponent<Props> = (props) => {
  const state = useTabs();
  const isSelected = createMemo(() => {
    return state.value() === props.value;
  });

  return <Show when={isSelected()}>{props.children}</Show>;
};
