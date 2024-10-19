import { useTabs } from "./Tabs";
import { Component, createMemo, Show, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["div"] & {
  value: string;
};
export const TabsContent: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value"]);
  const state = useTabs();
  const isSelected = createMemo(() => {
    return state.value() === props.value;
  });

  return (
    <Show when={isSelected()}>
      <div {...rest} />
    </Show>
  );
};
