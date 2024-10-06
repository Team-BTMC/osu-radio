import { ParentComponent } from "solid-js";
import List from "../list/List";
import { Props as ListItemProps } from "../list/ListItem";

const DropdownListItem: ParentComponent<ListItemProps> = (props) => {
  return (
    <List.Item class="dropdown-list-item" value={props.value}>
      <span>{props.children}</span>
      <i class="ri-check-line dropdown-list-item_icon" />
    </List.Item>
  );
};

export default DropdownListItem;
