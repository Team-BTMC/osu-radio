import { Component, JSX, onMount, Setter, Signal } from "solid-js";
import "../../assets/css/form/text-field.css";

type TextFieldProps = {
  value: Signal<string>;
  setInput?: Setter<HTMLElement | undefined>;
  children?: JSX.Element;
};

const TextField: Component<TextFieldProps> = (props) => {
  const [value, setValue] = props.value;
  let input;

  onMount(() => {
    if (props.setInput !== undefined) {
      props.setInput(input);
    }

    input.textContent = value();
  });

  const onInput = () => {
    setValue(
      String(input.textContent).replaceAll(
        String.fromCharCode(160), // non-breaking space
        String.fromCharCode(32) // breaking space
      ) ?? ""
    );
  };

  const onPaste = (evt) => {
    const selection = window.getSelection();
    if (selection === null) {
      return;
    }

    evt.stopPropagation();
    evt.preventDefault();

    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(evt.clipboardData.getData("Text")));
    selection.collapseToEnd();

    onInput();
  };

  const clear = () => {
    input.textContent = "";
    onInput();
    input.focus();
  };

  return (
    <div class="text-field button-like">
      {props.children}
      <div
        class="editable"
        ref={input}
        onInput={onInput}
        onKeyDown={(evt) => evt.stopPropagation()}
        onPaste={onPaste}
        contenteditable={true}
        spellcheck={false}
      ></div>
      <button class="icon hint" onClick={clear} title="Clear text input"></button>
    </div>
  );
};

export default TextField;
