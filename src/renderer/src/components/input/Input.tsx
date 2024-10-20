import { cva, VariantProps } from "class-variance-authority";
import { Component, JSX, splitProps } from "solid-js";

const inputStyles = cva(
  [
    "ring-offset-background placeholder:text-subtext focus-visible:ring-ring flex h-[42px] w-full rounded-lg px-3.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "",
        outlined: "border border-stroke bg-transparent border-solid block",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type Props = JSX.IntrinsicElements["input"] & VariantProps<typeof inputStyles>;
export const Input: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["class", "variant"]);
  return (
    <input
      {...rest}
      class={inputStyles({
        variant: props.variant,
        class: props.class,
      })}
    />
  );
};
