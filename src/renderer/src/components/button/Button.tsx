import { Component, JSX, splitProps } from "solid-js";

type ButtonVariant = "accent" | "primary" | "secondary" | "ghost";
type ButtonSize = "medium" | "large";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);

  const variant = () => local.variant || "primary";
  const size = () => local.size || "medium";

  const baseClasses = "rounded-lg transition-colors duration-200 ease-in-out font-medium";
  const variantClasses = {
    accent: "bg-accent text-text ",
    primary: "bg-red text-thick-material hover:bg-text/40",
    secondary: "bg-surface text-text",
    ghost: "bg-transparent text-text",
  };
  const sizeClasses = {
    medium: "px-4 py-2",
    large: "px-7 py-3 font-bold",
  };

  const buttonClasses = () =>
    `${baseClasses} ${variantClasses[variant()]} ${sizeClasses[size()]} ${local.class || ''}`;

  return (
    <button
      {...others}
      class={buttonClasses()}
    >
      {local.children}
    </button>
  );
};

export default Button;
