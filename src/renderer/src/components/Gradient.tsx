import { Component, createEffect } from 'solid-js';

const Gradient: Component<{ topColor: string, bottomColor: string, children }> = (props) => {
    createEffect(() => {
        document.documentElement.style.setProperty("--circle-0", props.topColor);
    });

    return (
        <div class="gradient">
            {props.children}
        </div>
    );
}

export default Gradient;
