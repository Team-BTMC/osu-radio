import PopoverAnchor from "./PopoverAnchor";
import PopoverContent from "./PopoverContent";
import PopoverOverlay from "./PopoverOverlay";
import { PopoverPortal, PopoverPortalMountStack } from "./PopoverPortal";
import PopoverTrigger from "./PopoverTrigger";
import "./styles.css";
import {
  computePosition,
  ComputePositionReturn,
  flip,
  FlipOptions,
  Middleware,
  offset,
  OffsetOptions,
  Placement,
  shift,
  ShiftOptions,
} from "@floating-ui/dom";
import useControllableState from "@renderer/lib/controllable-state";
import { Token, TokenNamespace } from "@renderer/lib/tungsten/token";
import {
  createSignal,
  createContext,
  useContext,
  ParentComponent,
  Accessor,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js";

export const DEFAULT_POPOVER_OPEN = false;
export const DEFAULT_CUSTOM_POSITION_PLACEMENT: Placement = "bottom-start";

export type Props = {
  offset?: OffsetOptions;
  flip?: true | FlipOptions;
  shift?: true | ShiftOptions;
  placement?: Placement;
  position?: Accessor<[number, number] | undefined>; // [x, y]
  defaultProp?: boolean;
  isOpen?: Accessor<boolean>;
  onValueChange?: (newOpen: boolean) => void;
};

export const [popoverStack, setPopoverStack] = createSignal<Token[]>([]);
const stackIds = new TokenNamespace();

export type Context = ReturnType<typeof useProviderValue>;

function useProviderValue(props: Props) {
  let resizeObserver: ResizeObserver | undefined;

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: props.defaultProp || DEFAULT_POPOVER_OPEN,
    onChange: props.onValueChange,
    prop: props.isOpen,
  });

  const [position, setPosition] = createSignal<ComputePositionReturn | null>(null);
  const [triggerRef, _setTriggerRef] = createSignal<HTMLElement | null>(null);
  const [contentRef, _setContentRef] = createSignal<HTMLDivElement | null>(null);
  const [id, setId] = createSignal<string>("");

  onMount(() => {
    window.addEventListener("resize", handleResize);

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  createEffect(() => {
    const triggerElement = triggerRef();
    if (!triggerElement) {
      return;
    }

    if (typeof resizeObserver !== "undefined") {
      // Disconnects old resize observer if the trigger was chaneged
      resizeObserver.disconnect();
      resizeObserver = undefined;
    }

    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(triggerElement);

    onCleanup(() => {
      resizeObserver?.disconnect();
    });
  });

  const setTriggerRef = (element: HTMLElement) => {
    _setTriggerRef(element);
    handleResize();
  };

  const setContentRef = (element: HTMLDivElement) => {
    _setContentRef(element);
    handleResize();
  };

  const handleResize = () => {
    const trigger = triggerRef();
    const content = contentRef();

    if (!trigger || !content) {
      return;
    }

    const [x, y] = props.position?.() ?? [];
    const hasCustomPosition = x !== undefined && y !== undefined;

    const middleware: Middleware[] = [];
    if (!hasCustomPosition) {
      middleware.push(offset(props.offset));
    }
    if (typeof props.flip !== "undefined") {
      middleware.push(flip(props.flip === true ? undefined : props.flip));
    }
    if (typeof props.shift !== "undefined") {
      middleware.push(shift(props.shift === true ? undefined : props.shift));
    }

    const getBoundingClientRect = () => {
      const triggerRect = trigger.getBoundingClientRect();
      if (!hasCustomPosition) {
        return triggerRect;
      }

      return {
        x,
        y,
        top: y,
        right: x,
        bottom: y,
        left: x,
        width: 0,
        height: 0,
      };
    };

    const getPlacement = () => {
      if (hasCustomPosition) {
        return DEFAULT_CUSTOM_POSITION_PLACEMENT;
      }
      return props.placement;
    };

    computePosition({ getBoundingClientRect }, content, {
      middleware,
      strategy: "fixed",
      placement: getPlacement(),
    }).then(setPosition);
  };

  createEffect(() => {
    if (isOpen()) {
      const newId = stackIds.create();
      setPopoverStack((p) => [...p, newId]);
      setId(newId);
    } else {
      stackIds.destroy(id());
      setPopoverStack((p) => p.filter((popoverId) => popoverId !== id()));
      setId("");
    }

    onCleanup(() => {
      stackIds.destroy(id());
    });
  });

  return {
    id,
    isOpen,
    open: () => {
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
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
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Portal: PopoverPortal,
  PortalMountStack: PopoverPortalMountStack,
  Trigger: PopoverTrigger,
  Overlay: PopoverOverlay,
});

export default Popover;
