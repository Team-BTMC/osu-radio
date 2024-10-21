import PopoverContent from "./PopoverContent";
import PopoverOverlay from "./PopoverOverlay";
import PopoverTrigger from "./PopoverTrigger";
import "./styles.css";
import {
  computePosition,
  ComputePositionReturn,
  offset,
  OffsetOptions,
  Placement,
} from "@floating-ui/dom";
import createControllableSignal from "@renderer/lib/controllable-signal";
import { createSignal, createContext, useContext, ParentComponent } from "solid-js";

export const DEFAULT_POPOVER_OPEN = false;

export type Props = {
  offset?: OffsetOptions;
  placement?: Placement;
  defaultProp?: boolean;
  isOpen?: boolean;
  onValueChange?: (newOpen: boolean) => void;
};

export type Context = ReturnType<typeof useProviderValue>;

function useProviderValue(props: Props) {
  const [isOpen, setIsOpen] = createControllableSignal<boolean>({
    defaultValue: props.defaultProp || DEFAULT_POPOVER_OPEN,
    onChange: (newValue) => props.onValueChange?.(newValue),
    value: () => props.isOpen,
  });

  const [position, setPosition] = createSignal<ComputePositionReturn | null>(null);
  const [triggerRef, _setTriggerRef] = createSignal<HTMLButtonElement | null>(null);
  const [contentRef, _setContentRef] = createSignal<HTMLDivElement | null>(null);

  const setTriggerRef = (element: HTMLButtonElement) => {
    _setTriggerRef(element);
    listenResize();
  };

  const setContentRef = (element: HTMLDivElement) => {
    _setContentRef(element);
    listenResize();
  };

  const listenResize = () => {
    const trigger = triggerRef();
    const content = contentRef();

    if (!trigger || !content) {
      return;
    }

    computePosition(trigger, content, {
      placement: props.placement,
      strategy: "fixed",
      middleware: [offset(props.offset)],
    }).then(setPosition);
  };

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((o) => !o),
    position,
    setPosition,
    triggerRef,
    setTriggerRef,
    setContentRef,
    contentRef,
  };
}

export const PopoverContext = createContext<Context>();

export const PopoverRoot: ParentComponent<Props> = (props) => {
  const state = useProviderValue(props);
  return <PopoverContext.Provider value={state}>{props.children}</PopoverContext.Provider>;
};

export function usePopover(): Context {
  const state = useContext(PopoverContext);
  if (!state) {
    throw new Error("usePopover needs to be used inisde of the `Popover` component.");
  }
  return state;
}

const Popover = Object.assign(PopoverRoot, {
  Content: PopoverContent,
  Trigger: PopoverTrigger,
  Overlay: PopoverOverlay,
});

export default Popover;
