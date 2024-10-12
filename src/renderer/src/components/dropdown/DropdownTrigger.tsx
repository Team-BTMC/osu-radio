import Popover from "../popover/Popover";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="flex items-center gap-2 rounded-full border-solid border-stroke px-4 py-0.5 hover:bg-thin-material">
      <i class="ri-arrow-down-s-line text-xl text-subtext" />
      <span class="text-sm">{props.children}</span>
    </Popover.Trigger>
  );
};

export default DropdownTrigger;
