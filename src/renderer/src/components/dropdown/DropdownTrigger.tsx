import Popover from "../popover/Popover";
import "./styles.css";
import { Component, JSX, mergeProps } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="dropdown-trigger">
      <i class="ri-arrow-down-s-line dropdown-trigger__icon" />
      <span class="dropdown-trigger__text">{props.children}</span>
    </Popover.Trigger>
  );
};

export default DropdownTrigger;
