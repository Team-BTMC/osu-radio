import Popover from "../popover/Popover";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="flex items-center gap-2 px-4 py-0.5 border-solid border-stroke rounded-full hover:bg-thin-material">
      <i class="ri-arrow-down-s-line text-subtext text-xl" />
      <span class="text-sm">{props.children}</span>
    </Popover.Trigger>
  );
};

export default DropdownTrigger;