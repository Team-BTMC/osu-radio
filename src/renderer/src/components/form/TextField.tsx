import { Component, JSX, onMount, Setter, Signal } from "solid-js";

type TextFieldProps = {
  value: Signal<string>;
  setInput?: Setter<HTMLElement | undefined>;
  children?: JSX.Element;
};

const TextField: Component<TextFieldProps> = (props) => {
  const [value, setValue] = props.value;
  let input: HTMLInputElement | undefined;

  onMount(() => {
    if (!input) {
      return;
    }

    if (props.setInput !== undefined) {
      props.setInput(input);
    }

    input.textContent = value();
  });

  const onInput = () => {
    if (!input) {
      return;
    }

    setValue(
      String(input.textContent).replaceAll(
        String.fromCharCode(160), // non-breaking space
        String.fromCharCode(32), // breaking space
      ) ?? "",
    );
  };

  const onPaste = (evt: ClipboardEvent) => {
    const selection = window.getSelection();
    if (selection === null || !evt.clipboardData) return;

    evt.stopPropagation();
    evt.preventDefault();

    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(evt.clipboardData.getData("Text")));
    selection.collapseToEnd();

    onInput();
  };

  const clear = () => {
    if (!input) {
      return;
    }

    input.textContent = "";
    onInput();
    input.focus();
  };

  return (
    <div class="button-like flex w-full items-center gap-2 overflow-hidden p-2 focus-within:outline-2 focus-within:transition-none hover:cursor-text">
      {props.children}
      <div
        class="flex-1 overflow-hidden whitespace-nowrap focus:outline-none"
        ref={input}
        onInput={onInput}
        onKeyDown={(evt) => evt.stopPropagation()}
        onPaste={onPaste}
        contenteditable={true}
        spellcheck={false}
      ></div>
      <button
        class="mr-1 grid place-items-center bg-transparent p-0 hover:cursor-pointer hover:bg-transparent focus:outline-none"
        onClick={clear}
        title="Clear text input"
      >
        {/* TODO: Add clear icon */}
      </button>
    </div>
  );
};

export default TextField;
