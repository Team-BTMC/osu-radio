import ListItem from "./ListItem";
import { useRovingFocusGroup } from "@renderer/lib/roving-focus-group/rovingFocusGroup";
import { Accessor, createContext, JSX, ParentComponent, splitProps, useContext } from "solid-js";

const DEFAULT_SELECTED_VALUE = "";

export type ListOptions = {
  defaultValue?: string;
  value?: Accessor<string>;
  onValueChange?: (newValue: string) => void;
};

export type Props = JSX.IntrinsicElements["div"] & ListOptions;

export type Context = ReturnType<typeof useProviderValue>;
function useProviderValue(props: ListOptions) {
  return useRovingFocusGroup({
    defaultProp: props.defaultValue || DEFAULT_SELECTED_VALUE,
    onChange: props.onValueChange,
    prop: props.value,
  });
}

export const ListContext = createContext<Context>();
const ListRoot: ParentComponent<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onValueChange", "defaultValue", "children"]);
  const value = useProviderValue(props);
  return (
    <ListContext.Provider value={value}>
      <div {...rest} {...value.attrs} class="flex flex-col gap-1">
        {props.children}
      </div>
    </ListContext.Provider>
  );
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
