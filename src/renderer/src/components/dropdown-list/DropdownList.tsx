import { RawList } from "../raw-list/RawList";
import DropdownListItem from "./DropdownListItem";
import { useRovingFocusGroup } from "@renderer/lib/roving-focus-group/rovingFocusGroup";
import { TokenNamespace } from "@shared/lib/tungsten/token";
import { createContext, createSignal, JSX, ParentComponent, useContext } from "solid-js";

export type Props = JSX.IntrinsicElements["div"];

export type Context = ReturnType<typeof useProviderValue>;
function useProviderValue() {
  const namespace = new TokenNamespace();
  let pointerLeaveTimeout: NodeJS.Timeout | undefined;

  const [isHighlighted, setIsHighlighted] = createSignal(false);

  const rovingFocusGroup = useRovingFocusGroup({
    updateFocusOnHover: true,
    onKeyUp: () => {
      setIsHighlighted(true);
    },
  });

  const handleItemPointerLeave = () => {
    clearTimeout(pointerLeaveTimeout);
    pointerLeaveTimeout = setTimeout(() => {
      setIsHighlighted(false);
    }, 60);
  };

  const handleItemPointerMove = () => {
    setIsHighlighted(true);
  };

  return {
    ...rovingFocusGroup,
    handleItemPointerMove,
    isHighlighted,
    handleItemPointerLeave,
    namespace,
  };
}

export const DropdownListContext = createContext<Context>();
const DropdownListRoot: ParentComponent<Props> = (props) => {
  const value = useProviderValue();
  return (
    <DropdownListContext.Provider value={value}>
      <RawList {...props} {...value.attrs} />
    </DropdownListContext.Provider>
  );
};

export function useDropdownList(): Context {
  const state = useContext(DropdownListContext);
  if (!state) {
    throw new Error("useDropdownList needs to be used inisde of the `ListContext` component.");
  }
  return state;
}

const DropdownList = Object.assign(DropdownListRoot, {
  Item: DropdownListItem,
});

export default DropdownList;
