import { RawList } from "../raw-list/RawList";
import SelectableListItem from "./SelectableListItem";
import useControllableState from "@renderer/lib/controllable-state";
import { useRovingFocusGroup } from "@renderer/lib/roving-focus-group/rovingFocusGroup";
import { Accessor, createContext, JSX, ParentComponent, splitProps, useContext } from "solid-js";

const DEFAULT_SELECTED_VALUE = "";

export type SelectableListOptions = {
  defaultValue?: string;
  value?: Accessor<string>;
  onValueChange?: (newValue: string) => void;
};

export type Props = JSX.IntrinsicElements["div"] & SelectableListOptions;

export type Context = ReturnType<typeof useProviderValue>;
function useProviderValue(props: SelectableListOptions) {
  const rovingFocusGroup = useRovingFocusGroup({
    updateFocusOnHover: true,
    defaultProp: props.value?.() ?? props.defaultValue,
  });
  const [selectedItem, setSelectedItem] = useControllableState({
    defaultProp: props.defaultValue || DEFAULT_SELECTED_VALUE,
    onChange: props.onValueChange,
    prop: props.value,
  });

  return {
    ...rovingFocusGroup,
    selectedItem,
    setSelectedItem,
  };
}

export const SelectableListContext = createContext<Context>();
const SelectableListRoot: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onValueChange", "defaultValue", "children"]);
  const value = useProviderValue(props);
  return (
    <SelectableListContext.Provider value={value}>
      <RawList {...rest} {...value.attrs}>
        {props.children}
      </RawList>
    </SelectableListContext.Provider>
  );
};

export function useSelectableList(): Context {
  const state = useContext(SelectableListContext);
  if (!state) {
    throw new Error("useSelectableList needs to be used inisde of the `ListContext` component.");
  }
  return state;
}

const SelectableList = Object.assign(SelectableListRoot, {
  Item: SelectableListItem,
});

export default SelectableList;
