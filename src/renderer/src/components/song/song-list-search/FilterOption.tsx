import Popover, { Props as PopoverProps } from "@renderer/components/popover/Popover";
import { Props as PopoverContentProps } from "@renderer/components/popover/PopoverContent";
import { cn } from "@renderer/lib/css.utils";
import { ChevronDownIcon } from "lucide-solid";
import { Component, createMemo, JSX, mergeProps, ParentComponent, splitProps } from "solid-js";

// ------------
// Container
// ------------
type FilterOptionContainerProps = {
  popoverProps?: PopoverProps;
} & JSX.IntrinsicElements["div"];
const FilterOptionContainer: Component<FilterOptionContainerProps> = (_props) => {
  const [props, rest] = splitProps(_props, ["class", "popoverProps"]);

  const mergedPopoverProps = createMemo(() => {
    const mergedProps = mergeProps<PopoverProps[]>(
      { placement: "bottom-start", offset: 10 },
      props.popoverProps ?? {},
    );
    return mergedProps;
  });

  return (
    <Popover {...mergedPopoverProps}>
      <div class={cn("flex p-0.5 items-center rounded-lg bg-surface", props.class)} {...rest} />
    </Popover>
  );
};

// ------------
// Label
// ------------
type FilterOptionLabelProps = JSX.IntrinsicElements["p"];
export const FilterOptionLabel: Component<FilterOptionLabelProps> = (_props) => {
  const [props, rest] = splitProps(_props, ["class"]);
  return <p class={cn("py-1.5 px-3 text-sm", props.class)} {...rest} />;
};

// ------------
// Trigger
// ------------
export const FilterOptionList: ParentComponent = (props) => {
  return (
    <div
      class="bg-thick-material rounded-md flex items-center overflow-hidden border-2 border-thick-material gap-0.5"
      {...props}
    />
  );
};

// ------------
// Trigger
// ------------
type FilterOptionTriggerProps = JSX.IntrinsicElements["button"];
export const FilterOptionTrigger: Component<FilterOptionTriggerProps> = (_props) => {
  const [props, rest] = splitProps(_props, ["class", "children"]);

  return (
    <Popover.Trigger
      {...rest}
      class={cn(
        "hover:bg-surface py-1 px-2.5 rounded text-sm flex gap-1.5 items-center focus-visible:bg-surface focus-within:outline-none",
        props.class,
      )}
    >
      <span>{props.children}</span>
      <ChevronDownIcon size={16} class="text-subtext" />
    </Popover.Trigger>
  );
};

// ------------
// Item
// ------------
type FilterOptionItemProps = JSX.IntrinsicElements["button"];
export const FilterOptionItem: Component<FilterOptionItemProps> = (_props) => {
  const [props, rest] = splitProps(_props, ["class", "children"]);

  return (
    <button
      {...rest}
      class={cn(
        "hover:bg-surface py-1 px-2.5 rounded text-sm flex gap-1 items-center focus-within:bg-surface focus-within:outline-none",
        props.class,
      )}
    >
      {props.children}
    </button>
  );
};

// ------------
// Content
// ------------
const FilterOptionContent: ParentComponent<PopoverContentProps> = (props) => {
  return (
    <Popover.Portal>
      <Popover.Overlay />
      <Popover.Content
        {...props}
        class={cn(
          "rounded-lg border border-stroke bg-thick-material p-2 backdrop-blur-md",
          props.class,
        )}
      />
    </Popover.Portal>
  );
};

const FilterOption = Object.assign(FilterOptionContainer, {
  Label: FilterOptionLabel,
  List: FilterOptionList,
  Trigger: FilterOptionTrigger,
  Content: FilterOptionContent,
  Item: FilterOptionItem,
});

export default FilterOption;