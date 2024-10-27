import { TabsContent } from "./TabsContent";
import { TabsIndicator } from "./TabsIndicator";
import { TabsList } from "./TabsList";
import TabsTrigger from "./TabsTrigger";
import { useRovingFocusGroup } from "@renderer/lib/roving-focus-group/rovingFocusGroup";
import { Accessor, createContext, ParentComponent, useContext } from "solid-js";

const DEFAULT_SELECTED_VALUE = "";

export type Props = {
  defaultValue?: string;
  value?: Accessor<string>;
  onValueChange?: (newValue: string) => void;
};
export type Context = ReturnType<typeof useProviderValue>;

function useProviderValue(props: Props) {
  return useRovingFocusGroup({
    defaultProp: props.defaultValue || DEFAULT_SELECTED_VALUE,
    onChange: props.onValueChange,
    prop: props.value,
  });
}

export const TabsContext = createContext<Context>();
const TabsRoot: ParentComponent<Props> = (props) => {
  const value = useProviderValue(props);
  return <TabsContext.Provider value={value}>{props.children}</TabsContext.Provider>;
};

export function useTabs(): Context {
  const state = useContext(TabsContext);
  if (!state) {
    throw new Error("useList needs to be used inisde of the `ListContext` component.");
  }
  return state;
}

const Tabs = Object.assign(TabsRoot, {
  Trigger: TabsTrigger,
  List: TabsList,
  Content: TabsContent,
  Indicator: TabsIndicator,
});

export default Tabs;
