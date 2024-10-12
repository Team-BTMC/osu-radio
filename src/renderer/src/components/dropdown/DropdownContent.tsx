import List from "../list/List";
import { Props as ListProps } from "../list/List";
import Popover from "../popover/Popover";
import { ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";

export const DropdownContent: ParentComponent = (props) => {
  return (
    <Portal>
      <Popover.Overlay />
      <Popover.Content class="dropdown-content">{props.children}</Popover.Content>
    </Portal>
  );
};

export const DropdownList: ParentComponent<ListProps> = (props) => {
  return (
    <Portal>
      <Popover.Overlay />
      <Popover.Content class="dropdown-content">
        <List {...props} />
      </Popover.Content>
    </Portal>
  );
};
