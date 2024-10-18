import "../../assets/css/search/tag-item.css";
import { XIcon } from "lucide-solid";
import { Component } from "solid-js";

export type TagItemProps = {
  name: string;
  isSpecial: boolean;
  onRemove: (name: string) => any;
  onChange: (name: string) => any;
};

const TagItem: Component<TagItemProps> = (props) => {
  let container;

  const changeState = (evt: Event) => {
    evt.preventDefault();
    props.onChange(props.name);
  };

  return (
    <div
      ref={container}
      class={"tag"}
      classList={{ special: props.isSpecial === true }}
      onContextMenu={changeState}
    >
      <span>{props.name}</span>
      <button onClick={() => props.onRemove(props.name)}>
        <XIcon size={20} />
      </button>
    </div>
  );
};

export default TagItem;
