import "./styles.css";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const IconButton: Component<Props> = (props) => {
  return <button {...props} class={`icon-button ${props.class}`} />;
};

export default IconButton;
