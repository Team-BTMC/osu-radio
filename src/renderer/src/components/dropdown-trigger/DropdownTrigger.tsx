import { Component, JSX, mergeProps } from "solid-js";

import "./styles.css";
import Fa from "solid-fa";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type Props = JSX.IntrinsicElements["button"];
const DropdownTrigger: Component<Props> = ({ children, ...rest }) => {
  return (
    <button {...mergeProps({ class: "dropdown-trigger" }, rest)}>
      <Fa icon={faChevronDown} class="dropdown-trigger__icon" aria-hidde="true" />
      <span class="dropdown-trigger__text">{children}</span>
    </button>
  );
};

export default DropdownTrigger;
