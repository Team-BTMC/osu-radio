import { Component, createSignal, For, JSX, onCleanup, onMount, Setter, Show, splitProps } from 'solid-js';
import { OmitPropsWithoutReturnType, Optional, RequestAPI } from '../../../@types';
import ResetSignal from '../lib/ResetSignal';



export type InfiniteScrollerRequest = {
  index: number,
  init: number,
  direction: "up" | "down"
}

export type InfiniteScrollerResponse<T = any> = Optional<{
  index: number,
  total: number,
  items: T[]
}>

export type InfiniteScrollerInitResponse = Optional<{
  initialIndex: number
}>

type InfinityScrollerProps = {
  apiKey: keyof OmitPropsWithoutReturnType<RequestAPI, InfiniteScrollerResponse>,
  initAPIKey: keyof OmitPropsWithoutReturnType<RequestAPI, InfiniteScrollerInitResponse>,
  apiData?: any,
  builder: (props: any) => JSX.Element,
  reset?: ResetSignal,
  onLoadInitial?: () => any,
  onLoadItems?: () => any,
  fallback?: JSX.Element,
  autoload?: boolean,
  setResultCount?: Setter<number>,
} & JSX.HTMLAttributes<HTMLDivElement>

const InfiniteScroller: Component<InfinityScrollerProps> = (props) => {
  const [, rest] = splitProps(props, [
    "apiKey",
    "initAPIKey",
    "apiData",
    "builder",
    "reset",
    "onLoadInitial",
    "fallback",
    "autoload",
    "setResultCount"
  ]);



  const [elements, setElements] = createSignal<any[]>([]);
  const [show, setShow] = createSignal(true);
  let container;
  let init: number;



  let indexStart = -1;
  const loadStart = async () => {
    const request: InfiniteScrollerRequest = {
      index: indexStart,
      init,
      direction: 'up'
    };

    const response = await window.api.request(props.apiKey, request, props.apiData);
    if (response.isNone) {
      return;
    }

    setElements((response.value.items as any[]).concat(elements()));
    indexStart = response.value.index;

    if (props.setResultCount !== undefined) {
      props.setResultCount(response.value.total);
    }

    if (props.onLoadItems !== undefined) {
      props.onLoadItems();
    }

    observerStart.observe(container.children[0]);
  };
  const observerStart = new IntersectionObserver(async entries => {
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
  }, {
    root: container,
    rootMargin: "50px",
    threshold: 0
  });



  let indexEnd = 0;
  const loadEnd = async () => {
    const request: InfiniteScrollerRequest = {
      index: indexEnd,
      init,
      direction: 'down'
    };

    const response = await window.api.request(props.apiKey, request, props.apiData);
    if (response.isNone) {
      return;
    }

    setElements(elements().concat(response.value.items));
    indexEnd = response.value.index;

    if (props.setResultCount !== undefined) {
      props.setResultCount(response.value.total);
    }

    if (props.onLoadItems !== undefined) {
      props.onLoadItems();
    }

    observerEnd.observe(container.children[container.children.length - 1]);
  }
  const observerEnd = new IntersectionObserver(async entries => {
    const lastElement = entries[0];

    if (!lastElement.isIntersecting) {
      return;
    }

    observerEnd.unobserve(lastElement.target);
    await loadEnd();
  }, {
    root: container,
    rootMargin: "50px",
    threshold: 0
  });



  const reset = async () => {
    setElements([]);

    observerEnd.disconnect();
    observerStart.disconnect();

    const opt = (await window.api.request(props.initAPIKey));
    if (opt.isNone) {
      setShow(false);
      return;
    }

    setShow(true);

    init = opt.value.initialIndex;
    indexEnd = init;

    await loadEnd();

    if (init !== 0) {
      indexStart = init - 1;
      await loadStart();
    }

    if (props.onLoadInitial !== undefined) {
      props.onLoadInitial();
    }
  }

  onMount(async () => {
    if (props.autoload === undefined || props.autoload === true) {
      await reset();
    }

    if (props.reset !== undefined) {
      props.reset.onReset(reset);
    }
  });

  onCleanup(() => {
    if (props.reset !== undefined) {
      props.reset.removeOnReset(reset);
    }
  });

  return (
    <div class={"list"} ref={container} {...rest}>
      <Show when={show() === true} fallback={props.fallback ?? <div>No items...</div>}>
        <For each={elements()}>{componentProps =>
          props.builder(componentProps)
        }</For>
      </Show>
    </div>
  );
}

export default InfiniteScroller;