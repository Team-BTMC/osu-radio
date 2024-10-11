import Popover from "../popover/Popover";
import "./styles.css";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownSelectTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="dropdown-select-trigger">
      <span class="dropdown-select-trigger__text">{props.children}</span>
      <i class="ri-arrow-down-s-line dropdown-select-trigger__icon" />
    </Popover.Trigger>
  );
};

export default DropdownSelectTrigger;
