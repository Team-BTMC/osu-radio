import List from "../list/List";
import { Props as ListItemProps } from "../list/ListItem";
import { ParentComponent } from "solid-js";

const DropdownListItem: ParentComponent<ListItemProps> = (props) => {
  return (
    <List.Item
      class="flex items-center justify-between rounded-md py-1.5 px-2.5 hover:bg-surface data-[selected=true]:bg-overlay/35"
      value={props.value}
    >
      <span>{props.children}</span>
    </List.Item>
  );
};

export default DropdownListItem;
