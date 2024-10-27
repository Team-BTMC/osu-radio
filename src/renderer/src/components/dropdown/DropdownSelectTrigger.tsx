import Popover from "@/components/popover/Popover";
import { ChevronDownIcon } from "lucide-solid";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownSelectTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="flex items-center justify-between gap-2 rounded bg-surface px-4 py-2.5 hover:bg-overlay/50">
      <span class="text-base leading-6">{props.children}</span>
      <ChevronDownIcon size={20} class="text-subtext" />
    </Popover.Trigger>
  );
};

export default DropdownSelectTrigger;
