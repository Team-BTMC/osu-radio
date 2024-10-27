import { OmitPropsWithoutReturnType, Optional } from "@types";
import { RequestAPI } from "src/RequestAPI";
import Impulse from "@/lib/Impulse";
import {
  Component,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
  Setter,
  Show,
  splitProps,
} from "solid-js";

export type InfiniteScrollerRequest = {
  index: number;
  init: number;
  direction: "up" | "down";
};

export type InfiniteScrollerResponse<T = any> = Optional<{
  index: number;
  items: T[];
}>;

export type InfiniteScrollerInitResponse = Optional<{
  initialIndex: number;
  count: number;
}>;

type InfinityScrollerProps = {
  apiKey: keyof OmitPropsWithoutReturnType<RequestAPI, InfiniteScrollerResponse>;
  apiData?: any;

  apiInitKey: keyof OmitPropsWithoutReturnType<RequestAPI, InfiniteScrollerInitResponse>;
  apiInitData?: any;

  builder: (props: any) => JSX.Element;
  reset?: Impulse;

  onLoadInitial?: () => any;
  onLoadItems?: () => any;
  fallback?: JSX.Element;
  autoload?: boolean;

  setCount?: Setter<number>;
} & JSX.HTMLAttributes<HTMLDivElement>;

const InfiniteScroller: Component<InfinityScrollerProps> = (props) => {
  const [, rest] = splitProps(props, [
    "apiKey",
    "apiInitKey",
    "apiData",
    "builder",
    "reset",
    "onLoadInitial",
    "fallback",
    "autoload",
    "setCount",
  ]);

  const [elements, setElements] = createSignal<any[]>([]);
  const [show, setShow] = createSignal(true);
  let container: HTMLDivElement | undefined;
  let init: number;

  let indexStart = -1;
  const loadStart = async () => {
    if (!container) {
      return;
    }

    const request: InfiniteScrollerRequest = {
      index: indexStart,
      init,
      direction: "up",
    };

    const response = await window.api.request(props.apiKey, request, props.apiData);
    if (response.isNone) {
      return;
    }

    setElements((response.value.items as any[]).concat(elements()));
    indexStart = response.value.index;

    if (props.onLoadItems !== undefined) {
      props.onLoadItems();
    }

    observerStart.observe(container.children[0]);
  };
  const observerStart = new IntersectionObserver(
    async (entries) => {
      if (!container) {
        return;
      }

      const first = entries[0];

      if (!first.isIntersecting) {
        return;
      }

      observerStart.unobserve(first.target);
      await loadStart();

      let offset = 0;
      for (const child of container.children) {
        if (child === first.target) {
          break;
        }

        offset += child.scrollHeight;
      }

      container.scrollTo(0, offset);
    },
    {
      root: container,
      rootMargin: "50px",
      threshold: 0,
    },
  );

  let indexEnd = 0;
  const loadEnd = async () => {
    if (!container) {
      return;
    }

    const request: InfiniteScrollerRequest = {
      index: indexEnd,
      init,
      direction: "down",
    };

    const response = await window.api.request(props.apiKey, request, props.apiData);
    if (response.isNone) {
      return;
    }

    setElements(elements().concat(response.value.items));
    indexEnd = response.value.index;

    if (props.onLoadItems !== undefined) {
      props.onLoadItems();
    }

    observerEnd.observe(container.children[container.children.length - 1]);
  };
  const observerEnd = new IntersectionObserver(
    async (entries) => {
      const lastElement = entries[0];

      if (!lastElement.isIntersecting) {
        return;
      }

      observerEnd.unobserve(lastElement.target);
      await loadEnd();
    },
    {
      root: container,
      rootMargin: "50px",
      threshold: 0,
    },
  );

  const reset = async () => {
    setElements([]);

    observerEnd.disconnect();
    observerStart.disconnect();

    const opt = await window.api.request(props.apiInitKey, props.apiInitData);
    if (opt.isNone || opt.value.count === 0) {
      setShow(false);

      if (props.setCount !== undefined) {
        props.setCount(0);
      }

      return;
    }

    setShow(true);

    init = opt.value.initialIndex;
    indexEnd = init;

    if (props.setCount !== undefined) {
      props.setCount(opt.value.count);
    }

    await loadEnd();

    if (init !== 0) {
      indexStart = init - 1;
      await loadStart();
    }

    if (props.onLoadInitial !== undefined) {
      props.onLoadInitial();
    }
  };

  onMount(async () => {
    if (props.autoload === undefined || props.autoload === true) {
      await reset();
    }

    if (props.reset !== undefined) {
      props.reset.listen(reset);
    }
  });

  onCleanup(() => {
    if (props.reset !== undefined) {
      props.reset.removeListener(reset);
    }
  });

  return (
    <div class={"list flex flex-col gap-4 py-4"} ref={container} {...rest}>
      <Show when={show() === true} fallback={props.fallback ?? <div>No items...</div>}>
        <For each={elements()}>{(componentProps) => props.builder(componentProps)}</For>
      </Show>
    </div>
  );
};

export default InfiniteScroller;
