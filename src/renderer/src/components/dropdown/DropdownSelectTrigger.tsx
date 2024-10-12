import Popover from "../popover/Popover";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownSelectTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="flex items-center justify-between gap-2 px-4 py-2.5 rounded bg-surface hover:bg-thin-material focus:bg-thin-material">
      <span class="text-base leading-6">{props.children}</span>
      <i class="ri-arrow-down-s-line text-subtext text-xl" />
    </Popover.Trigger>
  );
};

export default DropdownSelectTrigger;