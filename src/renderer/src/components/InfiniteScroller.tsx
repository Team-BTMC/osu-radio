import { Component, createSignal, For, JSX, onCleanup, onMount, Setter, splitProps } from 'solid-js';
import { OmitPropsWithoutReturnType, Optional, RequestAPI } from '../../../@types';
import ResetSignal from '../lib/ResetSignal';



export type InfiniteScrollerResponse<T = any> = Optional<{
  index: number,
  total: number,
  items: T[]
}>;

type InfinityScrollerProps = {
  apiKey: keyof OmitPropsWithoutReturnType<RequestAPI, InfiniteScrollerResponse>,
  apiData?: any,
  builder: (props: any) => JSX.Element,
  reset?: ResetSignal,
  autoload?: boolean
  setResultCount?: Setter<number>
} & JSX.HTMLAttributes<HTMLDivElement>;

const InfiniteScroller: Component<InfinityScrollerProps> = (props) => {
  let container;
  let index = 0;
  const [elements, setElements] = createSignal<any[]>([]);

  const load = () => {
    window.api.request(props.apiKey, index, props.apiData).then(response => {
      if (response.isNone) {
        return;
      }

      setElements(elements().concat(response.value.items));
      index = response.value.index;
      if (props.setResultCount !== undefined) {
        props.setResultCount(response.value.total);
      }

      observer.observe(container.children[container.children.length - 1]);
    });
  }

  const observer = new IntersectionObserver(entries => {
    const lastElement = entries[0];

    if (!lastElement.isIntersecting) {
      return;
    }

    observer.unobserve(lastElement.target);
    load();
  }, {
    root: container,
    rootMargin: "50px",
    threshold: 0
  });
  const reset = () => {
    setElements([]);
    observer.disconnect();
    index = 0;
    load();
  }

  onMount(() => {
    if (props.autoload === undefined || props.autoload === true) {
      reset();
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

  const [, rest] = splitProps(props, ["apiKey", "reset", "builder", "autoload"]);

  return (
    <div class={"list"} ref={container} {...rest}>
      <For each={elements()}>{componentProps =>
        props.builder(componentProps)
      }</For>
    </div>
  );
}

export default InfiniteScroller;