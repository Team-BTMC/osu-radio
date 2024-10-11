import ListItem from "./ListItem";
import useControllableState from "@renderer/lib/controllable-state";
import { Accessor, createContext, ParentComponent, useContext } from "solid-js";

const DEFAULT_SELECTED_VALUE = "";

export type Props = {
  defaultValue?: string;
  value?: Accessor<string>;
  onValueChange?: (newValue: string) => void;
};

export type Context = ReturnType<typeof useProviderValue>;
function useProviderValue(props: Props) {
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultProp: props.defaultValue || DEFAULT_SELECTED_VALUE,
    onChange: props.onValueChange,
    prop: props.value,
  });

  return {
    selectedValue,
    setSelectedValue,
  };
}

export const ListContext = createContext<Context>();
const ListRoot: ParentComponent<Props> = (props) => {
  const value = useProviderValue(props);
  return <ListContext.Provider value={value}>{props.children}</ListContext.Provider>;
};

export function useList(): Context {
  const state = useContext(ListContext);
  if (!state) {
    throw new Error("useList needs to be used inisde of the `ListContext` component.");
  }
  return state;
}

const List = Object.assign(ListRoot, {
  Item: ListItem,
});

export default List;
