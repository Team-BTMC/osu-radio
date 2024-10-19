import { RovingFocusItem } from "./RovingFocusItem";
import useControllableState from "@renderer/lib/controllable-state";
import { Accessor, createContext, ParentComponent, useContext } from "solid-js";

export type Props = {
  currentTabStopId?: Accessor<string>;
  defaultCurrentTabStopId?: string;
  onCurrentTabStopIdChange?: (tabStopId: string | null) => void;
};

export type Context = ReturnType<typeof useProviderValue>;

function useProviderValue(props: Props) {
  const [currentTabStopId, setCurrentTabStopId] = useControllableState<string>({
    defaultProp: props.defaultCurrentTabStopId || "",
    onChange: props.onCurrentTabStopIdChange,
    prop: props.currentTabStopId,
  });

  const onItemFocus = (id: string) => {
    setCurrentTabStopId(id);
  };

  return {
    currentTabStopId,
    onItemFocus,
    setCurrentTabStopId,
  };
}

export const RovingFocusGroupContext = createContext<Context>();
export const RovingFocusGroupRoot: ParentComponent<Props> = (props) => {
  const state = useProviderValue(props);
  return (
    <RovingFocusGroupContext.Provider value={state}>
      {props.children}
    </RovingFocusGroupContext.Provider>
  );
};

export function useRovingFocus(): Context {
  const state = useContext(RovingFocusGroupContext);
  if (!state) {
    throw new Error("usePopover needs to be used inisde of the `Popover` component.");
  }
  return state;
}

const RovingFocusGroup = Object.assign(RovingFocusGroupRoot, {
  Item: RovingFocusItem,
});

export default RovingFocusGroup;
