import { Component, For, onMount, Setter } from "solid-js";
import "../assets/css/select.css";

export type SelectOption = {
  value: string;
  text: string;
  selected?: boolean;
};

type SelectProps = {
  setValue: Setter<string>;
  options: SelectOption[];
  selected?: string;
  disabled?: boolean;
};

const Select: Component<SelectProps> = (props) => {
  let select;

  onMount(() => {
    props.setValue(select.value);
  });

  return (
    <select
      class={"button-like select"}
      ref={select}
      onchange={() => props.setValue(select.value)}
      disabled={props.disabled}
    >
      <For each={props.options}>
        {(option) => (
          <option
            value={option.value}
            selected={option.selected === true || option.value === props.selected}
          >
            {option.text}
          </option>
        )}
      </For>
    </select>
  );
};

export default Select;
