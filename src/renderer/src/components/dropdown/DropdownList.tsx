import List from "../list/List";
import { Props as ListProps } from "../list/List";
import Popover from "../popover/Popover";
import { ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";

const DropdownList: ParentComponent<ListProps> = (props) => {
  return (
    <Portal>
      <Popover.Overlay />
      <Popover.Content class="flex flex-col bg-thick-material backdrop-blur-md p-3 w-fit min-w-48 rounded-xl border border-stroke">
        <List {...props} />
      </Popover.Content>
    </Portal>
  );
};

export default DropdownList;