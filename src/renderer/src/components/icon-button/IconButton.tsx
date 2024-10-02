import { Component, JSX, mergeProps } from "solid-js";
import "./styles.css";

type Props = JSX.IntrinsicElements["button"];
const IconButton: Component<Props> = (props) => {
  return <button {...mergeProps({ class: "icon-buton" }, props)} />;
};

export default IconButton;
