import { cn } from "@renderer/lib/css.utils";
import { MinusIcon, SquareIcon, XIcon } from "lucide-solid";
import { Component, JSX, splitProps } from "solid-js";

export const WindowsControls: Component = () => {
  const minimize = () => {
    window.api.request("window::minimize");
  };
  const toggleMaximize = () => {
    window.api.request("window::maximize");
  };
  const close = () => {
    window.api.request("window::close");
  };

  return (
    <div class="no-drag flex">
      <WindownButton onClick={minimize}>
        <MinusIcon size={20} />
      </WindownButton>
      <WindownButton onClick={toggleMaximize}>
        <SquareIcon size={18} />
      </WindownButton>
      <WindownButton onClick={close} class="hover:bg-red-500">
        <XIcon size={20} />
      </WindownButton>
    </div>
  );
};

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
const WindownButton: Component<ButtonProps> = (_props) => {
  const [props, rest] = splitProps(_props, ["class"]);
  return (
    <button
      class={cn("app-no-drag flex items-center justify-center p-2 hover:bg-surface", props.class)}
      {...rest}
    />
  );
};
