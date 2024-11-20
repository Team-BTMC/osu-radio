import { usePopover } from "./Popover";
import { Component, splitProps, Switch, Match } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type PartialButtonProps = Partial<JSX.IntrinsicElements["button"]>;
export type Props = Omit<PartialButtonProps, "ref" | "onClick" | "children"> & {
  children?: JSX.Element | ((props: PartialButtonProps) => JSX.Element);
};

const PopoverTrigger: Component<Props> = (_props) => {
  const state = usePopover();
  const [props, rest] = splitProps(_props, ["children"]);

  const triggerProps: PartialButtonProps = {
    ref: state.setTriggerRef,
    // it complains about "data-open" not being a string for some reason
    // so we have to cast it to a string
    ["data-open" as string]: state.isOpen(),
    onClick: () => {
      state?.open();
    },
    ...rest,
  };

  return (
    <Switch>
      <Match when={typeof props.children === "function"}>
        {(props.children as (props: PartialButtonProps) => JSX.Element)(triggerProps)}
      </Match>
      <Match when={typeof props.children !== "function"}>
        <button {...triggerProps}>{props.children as JSX.Element}</button>
      </Match>
    </Switch>
  );
};

export default PopoverTrigger;
