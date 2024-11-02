import { cn } from "@renderer/lib/css.utils";
import { Component, JSX, splitProps } from "solid-js";

export const RawListContainer: Component<JSX.IntrinsicElements["div"]> = (_props) => {
  const [props, rest] = splitProps(_props, ["class"]);
  return <div class={cn("flex flex-col gap-0.5", props.class)} {...rest} />;
};
export const RawListItem: Component<JSX.IntrinsicElements["button"]> = (_props) => {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <button
      class={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 disabled:opacity-50 disabled:pointer-events-none",
        props.class,
      )}
      {...rest}
    />
  );
};

/** List component with only styles */
export const RawList = Object.assign(RawListContainer, {
  Item: RawListItem,
});
