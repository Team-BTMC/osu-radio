import { Component, createMemo, JSX, ParentComponent } from "solid-js";
import Popover, { Props as PopoverProps, usePopover } from "../popover/Popover";
import { ChevronDownIcon } from "lucide-solid";
import List, { Props as ListProps } from "../list/List";
import ListItem, { Props as ListItemProps } from "../list/ListItem";

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

type Props = JSX.IntrinsicElements["button"];
export const SelectTrigger: ParentComponent<Props> = (props) => {
  return (
    <Popover.Trigger class="flex items-center justify-between gap-2 rounded bg-surface px-4 py-2.5 hover:bg-overlay">
      <span class="text-base leading-6">{props.children}</span>
      <ChevronDownIcon size={20} class="text-subtext" />
    </Popover.Trigger>
  );
};

export const SelectContent: Component<ListProps> = (props) => {
  const state = usePopover();

  const width = createMemo(() => {
    state.isOpen();
    const trigger = state.triggerRef();
    console.log("trigger", trigger?.getBoundingClientRect());
    if (!trigger) {
      return "0px";
    }

    return `${trigger.getBoundingClientRect().width}px`;
  });

  return (
    <>
      <Popover.Overlay />
      <Popover.Content
        style={{
          width: width(),
        }}
      >
        <List {...props} />
      </Popover.Content>
    </>
  );
};
export const SelectOption: Component<ListItemProps> = (props) => {
  return <ListItem {...props} />;
};

const Select = Object.assign(SelectContainer, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
});

export default Select;
