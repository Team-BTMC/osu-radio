import Popover, { Props as PopoverProps } from "../popover/Popover";
import { DropdownContent, DropdownList } from "./DropdownContent";
import DropdownListItem from "./DropdownListItem";
import DropdownSelectTrigger from "./DropdownSelectTrigger";
import DropdownTrigger from "./DropdownTrigger";
import { ParentComponent } from "solid-js";

const DropdownRoot: ParentComponent<PopoverProps> = (props) => {
  return <Popover placement="bottom-start" offset={10} {...props} />;
};

const Dropdown = Object.assign(DropdownRoot, {
  SelectTrigger: DropdownSelectTrigger,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  List: DropdownList,
  Item: DropdownListItem,
});

export default Dropdown;
