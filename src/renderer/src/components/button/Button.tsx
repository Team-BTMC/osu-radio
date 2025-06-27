import { cva, type VariantProps } from "class-variance-authority";
import { Component, JSX, splitProps } from "solid-js";

const buttonStyles = cva(
  ["rounded-lg transition-colors duration-200 ease font-medium cursor-pointer"],
  {
    variants: {
      variant: {
        primary: "bg-text text-thick-material hover:bg-text/80",
        secondary: "bg-surface text-text hover:bg-surface/40 border-stroke border border-solid",
        outlined: "bg-transparent border-stroke text-text hover:bg-surface border border-solid",
        ghost: "border-transparent hover:bg-surface",
        link: "bg-transparent text-text hover:underline text-decoration-2 underline-offset-2",
        "danger-outlined":
          "bg-transparent text-danger border border-solid border-danger hover:text-text hover:bg-danger",
      },
      size: {
        medium: "px-4 py-2",
        large: "px-7 py-2.5",
        icon: "grid place-items-center aspect-square size-9 p-1 -m-2",
        square: "grid place-items-center aspect-square h-10",
      },
      disabled: {
        true: "opacity-50 !cursor-default",
        false: "",
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
      class={buttonStyles({
        variant: local.variant,
        size: local.size,
        class: local.class,
        disabled: props.disabled,
      })}
      {...others}
    >
      {local.children}
    </button>
  );
};

export default Button;
