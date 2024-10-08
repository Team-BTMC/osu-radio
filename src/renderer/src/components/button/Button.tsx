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
    type: "button",
  };

  const mergedProps = mergeProps(defaultProps, props);
  const { children, variant: _, size: __, ...restProps } = mergedProps;

  return (
    <button
      {...restProps}
      class={`button ${mergedProps.variant} ${mergedProps.size} ${mergedProps.class ?? ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
