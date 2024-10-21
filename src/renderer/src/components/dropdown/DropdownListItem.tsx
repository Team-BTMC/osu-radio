import List from "../list/List";
import { Props as ListItemProps } from "../list/ListItem";
import { ParentComponent } from "solid-js";

const DropdownListItem: ParentComponent<ListItemProps> = (props) => {
  return (
    <List.Item
      class="flex items-center gap-4 rounded-md p-2 hover:bg-stroke data-[selected=true]:bg-overlay/30"
      value={props.value}
      onSelectedByClick={props.onSelectedByClick}
    >
      {props.children}
    </List.Item>
  );
};

export default DropdownListItem;
