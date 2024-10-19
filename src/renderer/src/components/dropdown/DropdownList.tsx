import List from "../list/List";
import { Props as ListProps } from "../list/List";
import Popover from "../popover/Popover";
import { ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";

const DropdownList: ParentComponent<ListProps> = (props) => {
  return (
    <Portal>
      <Popover.Overlay />
      <Popover.Content class="w-fit min-w-48 rounded-xl border border-stroke bg-thick-material p-3 backdrop-blur-md">
        <List class="flex flex-col gap-1" {...props} />
      </Popover.Content>
    </Portal>
  );
};

export default DropdownList;
