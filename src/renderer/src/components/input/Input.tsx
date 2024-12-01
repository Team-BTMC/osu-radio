import { cva, VariantProps } from "class-variance-authority";
import { Component, JSX, splitProps } from "solid-js";

export const inputStyles = cva(
  [
    "ring-offset-background placeholder:text-subtext flex w-full rounded-lg disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:bg-surface",
  ],
  {
    variants: {
      variant: {
        primary: "",
        outlined:
          "border border-stroke bg-transparent border-solid block focus-visible:border-grey-400",
      },
      size: {
        sm: "h-[32px] text-sm px-2.5",
        default: "h-[42px] text-base px-3.5 py-2",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "default",
    },
  },
);

type Props = JSX.IntrinsicElements["input"] & VariantProps<typeof inputStyles>;
export const Input: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["class", "variant", "size"]);
  return (
    <input
      {...rest}
      class={inputStyles({
        variant: props.variant,
        size: props.size,
        class: props.class,
      })}
    />
  );
};
