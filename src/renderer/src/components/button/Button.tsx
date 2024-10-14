import { cva, type VariantProps } from "class-variance-authority";
import { Component, JSX, splitProps } from "solid-js";

const buttonStyles = cva(
  "rounded-lg transition-colors duration-200 ease-in-out font-medium", // base classes
  {
    variants: {
      variant: {
        accent: "bg-accent text-thick-material hover:bg-accent/80",
        primary: "bg-text text-thick-material hover:bg-text/80",
        secondary: "bg-surface text-text ring-inset ring-1 ring-stroke hover:bg-surface/40",
        ghost: "bg-transparent border-stroke border-solid text-text hover:bg-surface",
        link: "bg-transparent text-text hover:underline text-decoration-2 underline-offset-2",
      },
      size: {
        medium: "px-4 py-2",
        large: "px-7 py-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);

  return (
    <button
      class={buttonStyles({ variant: local.variant, size: local.size, class: local.class })}
      {...others}
    >
      {local.children}
    </button>
  );
};

export default Button;
