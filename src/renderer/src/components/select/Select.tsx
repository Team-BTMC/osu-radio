import { Component, createMemo, ParentComponent, splitProps } from "solid-js";
import Popover, { Props as PopoverProps, usePopover } from "../popover/Popover";
import { Props as PopoverTriggerProps } from "../popover/PopoverTrigger";
import { ChevronsUpDownIcon } from "lucide-solid";
import SelectableList, { Props as ListProps } from "../selectable-list/SelectableList";
import SelectableListItem, { Props as ListItemProps } from "../selectable-list/SelectableListItem";
import { cn } from "@renderer/lib/css.utils";
import { inputStyles } from "../input/Input";
import { VariantProps } from "class-variance-authority";

export const SelectContainer: ParentComponent<PopoverProps> = (props) => {
  return (
    <Popover
      offset={{
        mainAxis: 4,
      }}
      placement="bottom-start"
      {...props}
    />
  );
};

type Props = PopoverTriggerProps & VariantProps<typeof inputStyles>;
export const SelectTrigger: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["class", "variant", "children"]);
  return (
    <Popover.Trigger
      {...rest}
      class={cn(
        inputStyles({ variant: props.variant, class: props.class }),
        "flex items-center justify-between gap-2 box-border h-auto min-h-[42px] hover:bg-surface data-[open='true']:bg-surface",
      )}
    >
      <span class="text-base leading-6">{props.children}</span>
      <ChevronsUpDownIcon size={20} class="text-subtext flex-shrink-0" />
    </Popover.Trigger>
  );
};

export const SelectContent: Component<ListProps> = (props) => {
  const state = usePopover();

  const width = createMemo(() => {
    state.isOpen();
    const trigger = state.triggerRef();
    if (!trigger) {
      return "0px";
    }

    return `${trigger.getBoundingClientRect().width}px`;
  });

  return (
    <Popover.Portal>
      <Popover.Overlay />
      <Popover.Content
        style={{
          width: width(),
        }}
      >
        <SelectableList {...props} />
      </Popover.Content>
    </Popover.Portal>
  );
};
export const SelectOption: Component<ListItemProps> = (props) => {
  return <SelectableListItem {...props} />;
};

const Select = Object.assign(SelectContainer, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
});

export default Select;
