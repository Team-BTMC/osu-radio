import useControllableState from "../controllable-state";
import { Accessor, createMemo } from "solid-js";

const ITEM_DATA_ATTR = "data-item";
const DEFAULT_SELECTED_VALUE = "";

const canFocus = (
  element: Element | null | undefined,
): element is Element & {
  focus(): void;
} => {
  if (!element || !("focus" in element) || typeof element.focus !== "function") {
    return false;
  }

  return true;
};

type Params = {
  defaultProp?: string;
  prop?: Accessor<string>;
  onChange?: (newValue: string) => void;
};
export function useRovingFocusGroup(props: Params) {
  let container!: HTMLElement;
  const [currentStopId, setCurrentStopId] = useControllableState({
    defaultProp: props.defaultProp || DEFAULT_SELECTED_VALUE,
    onChange: props.onChange,
    prop: props.prop,
  });

  const handleKeyUp = (event: KeyboardEvent) => {
    const orderedNodes = Array.from(container.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
    const currentlySelectedNodeIndex = orderedNodes.findIndex(
      (node) => node.getAttribute(ITEM_DATA_ATTR) === currentStopId(),
    );

    let newIndex = -1;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft": {
        if (currentlySelectedNodeIndex === 0) {
          return;
        }

        newIndex = currentlySelectedNodeIndex - 1;
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (currentlySelectedNodeIndex === orderedNodes.length - 1) {
          return;
        }

        newIndex = currentlySelectedNodeIndex + 1;
        break;
      }

      case "End":
      case "PageDown": {
        newIndex = 0;
        break;
      }

      case "Home":
      case "PageUp": {
        newIndex = orderedNodes.length - 1;
        break;
      }

      default:
        break;
    }

    if (newIndex === -1) {
      return;
    }

    const nextFocused = orderedNodes[newIndex];
    if (!canFocus(nextFocused)) {
      return;
    }

    nextFocused.focus();
    setCurrentStopId(nextFocused.getAttribute(ITEM_DATA_ATTR)!);
  };

  return {
    attrs: {
      ref: (node: HTMLElement) => {
        container = node;
      },
    },
    item: (
      tabStopId: string,
      options: {
        onSelectedByClick?: () => void;
      } = {},
    ) => {
      const handleClick = () => {
        setCurrentStopId(tabStopId);
        options.onSelectedByClick?.();
        const nextFocused = container.querySelector(`[${ITEM_DATA_ATTR}="${tabStopId}"]`);
        if (!canFocus(nextFocused)) {
          return;
        }

        nextFocused.focus();
      };

      const isSelected = createMemo(() => {
        return currentStopId() === tabStopId;
      });

      return {
        isSelected,
        attrs: {
          onKeyUp: handleKeyUp,
          onClick: handleClick,
          [ITEM_DATA_ATTR]: tabStopId ?? "fallback",
        },
      };
    },
  };
}
