import { createSignal, For, onCleanup, onMount, splitProps } from 'solid-js';
const InfiniteScroller = (props) => {
    let container;
    let index = 0;
    const [elements, setElements] = createSignal([]);
    const load = () => {
        window.api.request(props.apiKey, index).then(response => {
            console.log(response);
            if (response.isNone) {
                return;
            }
            setElements(elements().concat(response.value.items));
            index = response.value.index;
            observer.observe(container.children[container.children.length - 1]);
        });
    };
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
    };
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
    const [, rest] = splitProps(props, ["apiKey", "reset", "component", "autoload"]);
    return (<div ref={container} {...rest}>
      <For each={elements()}>{componentProps => props.component(componentProps)}</For>
    </div>);
};
export default InfiniteScroller;
