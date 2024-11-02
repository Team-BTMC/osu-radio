import { Component, createMemo, JSX, ParentComponent } from "solid-js";
import Popover, { Props as PopoverProps, usePopover } from "../popover/Popover";
import { ChevronsUpDownIcon } from "lucide-solid";
import SelectableList, { Props as ListProps } from "../selectable-list/SelectableList";
import SelectableListItem, { Props as ListItemProps } from "../selectable-list/SelectableListItem";

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
