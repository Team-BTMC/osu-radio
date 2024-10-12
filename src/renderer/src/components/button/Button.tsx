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
    accent: "bg-accent text-text hover:bg-accent/80",
    primary: "bg-text text-thick-material hover:bg-text/80",
    secondary: "bg-surface text-text ring-inset ring-1 ring-stroke hover:bg-surface/40",
    ghost: "bg-transparent border-stroke border-solid text-text hover:bg-surface",
    link: "bg-transparent text-text hover:underline text-decoration-2 underline-offset-2",
  };

  const sizeClasses = {
    medium: "px-4 py-2",
    large: "px-7 py-2.5",
  };

  const buttonClasses = () =>
    `${baseClasses} ${variantClasses[variant()]} ${sizeClasses[size()]} ${local.class || ""}`;

  return (
    <button {...others} class={buttonClasses()}>
      {local.children}
    </button>
  );
};

export default Button;
