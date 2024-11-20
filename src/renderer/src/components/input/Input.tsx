import { cva, VariantProps } from "class-variance-authority";
import { Component, JSX, splitProps } from "solid-js";

export const inputStyles = cva(
  [
    "ring-offset-background placeholder:text-subtext flex h-[42px] w-full rounded-lg px-3.5 py-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:bg-surface",
  ],
  {
    variants: {
      variant: {
        primary: "",
        outlined:
          "border border-stroke bg-transparent border-solid block focus-visible:border-grey-400",
      },
    },
    defaultVariants: {
      variant: "outlined",
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
