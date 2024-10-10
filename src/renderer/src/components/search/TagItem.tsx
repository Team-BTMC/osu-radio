import { Component } from "solid-js";
import Fa from "solid-fa";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/search/tag-item.css";

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
        <Fa icon={faXmark} />
      </button>
    </div>
  );
};

export default TagItem;
