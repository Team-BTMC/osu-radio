import List from "../list/List";
import { Props as ListItemProps } from "../list/ListItem";
import { ParentComponent } from "solid-js";

const DropdownListItem: ParentComponent<ListItemProps> = (props) => {
  return (
    <List.Item
      class="flex justify-between items-center p-2 rounded-md hover:bg-stroke data-[selected=true]:bg-overlay/30"
      value={props.value}
    >
      <span>{props.children}</span>
    </List.Item>
  );
};

export default DropdownListItem;