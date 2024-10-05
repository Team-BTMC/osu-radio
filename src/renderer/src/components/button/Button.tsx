import { Component, JSX, mergeProps } from "solid-js";
import "./styles.css";

type Props = JSX.IntrinsicElements["button"] & {
  variant?: "primary" | "secondary";
  size?: "medium" | "large";
};
const Button: Component<Props> = (props) => {
  const defaultProps: Props = {
    variant: "primary",
    size: "medium",
    type: "button"
  };

  const mergedProps = mergeProps(defaultProps, props);
  const { children, ...restProps } = mergedProps;

  return (
    <button
      class={`button ${mergedProps.variant} ${mergedProps.size} ${mergedProps.class ?? ""}`}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
