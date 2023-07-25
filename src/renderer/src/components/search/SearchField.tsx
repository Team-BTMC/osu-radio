import { Component, onMount, Setter, Signal } from 'solid-js';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/search/search-field.css";
import Fa from 'solid-fa';
import { GLOBAL_ICON_SCALE } from '../../App';



type SearchTextBoxProps = {
  value: Signal<string>,
  setInput?: Setter<HTMLElement | undefined>,
  children?: any
}

//todo rename to: TextField
const SearchField: Component<SearchTextBoxProps> = props => {
  const [value, setValue] = props.value;
  let input;

  onMount(() => {
    if (props.setInput !== undefined) {
      props.setInput(input);
    }

    input.textContent = value();
  });

  const onInput = () => {
    setValue(input.textContent.replaceAll(String.fromCharCode(160), String.fromCharCode(32)) ?? "");
  };

  const onPaste = evt => {
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
    <div class="search-field button-like">
      {props.children}
      <div
        class="editable"
        ref={input}
        onInput={onInput}
        onKeyDown={evt => evt.stopPropagation()}
        onPaste={onPaste}
        contenteditable={true}
        spellcheck={false}
      ></div>
      <button class="icon" onClick={clear}>
        <Fa icon={faXmark} scale={GLOBAL_ICON_SCALE}/>
      </button>
    </div>
  );
};



export default SearchField;