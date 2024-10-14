import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const IconButton: Component<Props> = (props) => {
  return (
    <button
      {...props}
      class={`-m-2 flex h-6 w-6 items-center justify-center rounded-full p-2 text-2xl hover:bg-surface focus:bg-surface ${props.class}`}
    />
  );
};

export default IconButton;
