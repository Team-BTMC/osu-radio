import Popover from "../popover/Popover";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownSelectTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="flex items-center justify-between gap-2 rounded bg-surface px-4 py-2.5 hover:bg-thin-material focus:bg-thin-material">
      <span class="text-base leading-6">{props.children}</span>
      <i class="ri-arrow-down-s-line text-xl text-subtext" />
    </Popover.Trigger>
  );
};

export default DropdownSelectTrigger;
