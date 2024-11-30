import useControllableState from "../controllable-state";
import { Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";

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
  updateFocusOnHover?: boolean;
  onKeyUp?: () => void;
};
export function useRovingFocusGroup(props: Params = {}) {
  let container!: HTMLElement;

  const [registeredTabs, setRegisteredTabs] = createSignal<string[]>([]);

  const [hasMounted, setHasMounted] = createSignal(false);
  const [currentStopId, setCurrentStopId] = useControllableState({
    defaultProp: props.defaultProp || DEFAULT_SELECTED_VALUE,
    onChange: props.onChange,
    prop: props.prop,
  });

  const onListmounted = () => {
    setHasMounted(true);
  };

  const findOrderedNodes = () => {
    return Array.from(container.querySelectorAll(`[${ITEM_DATA_ATTR}]:not([disabled])`));
  };

  onMount(() => {
    if (currentStopId()) {
      return;
    }

    tryFocusFirstItem();
  });

  const tryFocusFirstItem = () => {
    const [firstNode] = findOrderedNodes();
    if (!canFocus(firstNode)) {
      return;
    }

    firstNode.focus();
    setCurrentStopId(firstNode.getAttribute(ITEM_DATA_ATTR)!);
  };

  const handleItemKeyUp = (
    event: KeyboardEvent & {
      currentTarget: DOMElement;
      target: DOMElement;
    },
  ) => {
    if (!event.currentTarget.isSameNode(event.target)) {
      return;
    }

    props.onKeyUp?.();

    const orderedNodes = findOrderedNodes();
    const currentlySelectedNodeIndex = orderedNodes.findIndex(
      (node) => node.getAttribute(ITEM_DATA_ATTR) === currentStopId(),
    );

    let newIndex = -1;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft": {
        if (currentlySelectedNodeIndex === 0) {
          newIndex = currentlySelectedNodeIndex;
          break;
        }

        newIndex = currentlySelectedNodeIndex - 1;
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (currentlySelectedNodeIndex === orderedNodes.length - 1) {
          newIndex = currentlySelectedNodeIndex;
          break;
        }

        newIndex = currentlySelectedNodeIndex + 1;
        break;
      }

      case "Home":
      case "PageUp": {
        newIndex = 0;
        break;
      }

      case "End":
      case "PageDown": {
        newIndex = orderedNodes.length - 1;
        break;
      }

      default:
        break;
    }

    if (newIndex === -1) {
      return;
    }

    event.preventDefault();

    const nextFocused = orderedNodes[newIndex];
    if (!canFocus(nextFocused)) {
      return;
    }

    nextFocused.focus();
    setCurrentStopId(nextFocused.getAttribute(ITEM_DATA_ATTR)!);
  };

  const currentlyActiveElement = createMemo(() => {
    if (!hasMounted()) {
      return;
    }

    const stopId = currentStopId();
    const orderedNodes = Array.from(container?.querySelectorAll(`[${ITEM_DATA_ATTR}]`) ?? []);
    if (!orderedNodes) {
      return;
    }

    return orderedNodes.find((node) => node.getAttribute(ITEM_DATA_ATTR) === stopId) as HTMLElement;
  });

  return {
    registeredTabs,
    currentlyActiveElement,
    onListmounted,
    tryFocusFirstItem,
    value: currentStopId,
    attrs: {
      ref: (node: HTMLElement) => {
        container = node;
      },
    },
    item: (
      tabStopId?: string,
      options: {
        onSelectedByClick?: () => void;
        onPointerMove?: () => void;
      } = {},
    ) => {
      const getCurrentOption = () => {
        return container.querySelector(`[${ITEM_DATA_ATTR}="${tabStopId}"]`);
      };

      const handlePointerMove = () => {
        options.onPointerMove?.();

        if (!props.updateFocusOnHover) {
          return;
        }

        const optionToFocus = getCurrentOption();
        if (!canFocus(optionToFocus)) {
          return;
        }

        if (tabStopId) {
          setCurrentStopId(tabStopId);
        }

        optionToFocus.focus();
      };

      const handleClick = () => {
        if (!tabStopId) {
          return;
        }

        setCurrentStopId(tabStopId);
        options.onSelectedByClick?.();
        const nextFocused = getCurrentOption();
        if (!canFocus(nextFocused)) {
          return;
        }

        nextFocused.focus();
      };

      const isSelected = createMemo(() => {
        return currentStopId() === tabStopId;
      });

      const tabIndex = createMemo(() => {
        return isSelected() ? 0 : -1;
      });

      onMount(() => {
        if (!tabStopId) {
          return;
        }

        setRegisteredTabs((t) => [...t, tabStopId]);
        onCleanup(() => {
          setRegisteredTabs((t) => t.filter((tab) => tab !== tabStopId));
        });
      });

      return {
        isSelected,
        tabIndex,
        attrs: {
          onKeyUp: handleItemKeyUp,
          onClick: handleClick,
          onPointerMove: handlePointerMove,
          [ITEM_DATA_ATTR]: tabStopId ?? "fallback",
        },
      };
    },
  };
}
