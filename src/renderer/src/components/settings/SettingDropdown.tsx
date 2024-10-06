import { Component, Show } from 'solid-js';

import "../../assets/css/select.css";

type SettingDropdownProps = {
  label: string,
  options: Map<string, () => any>, // name of option, function after clicked
  disabled: false,
}

const SettingDropdown: Component<SettingDropdownProps> = props => {

  const changeOption = (e: Event) => {
    const option = (e.target as HTMLSelectElement).value;
    const functionToCall = props.options.get(option);
    if (functionToCall !== undefined) {
      functionToCall();
    }
  }

  return (
    <div class="settings-item">
      <div class="settings-item-container">
        <label>{props.label}</label>
        <Show when={props.options.size > 0} fallback={<div>Loading audio devices</div>}>
          <select class="button-like select" disabled={props.disabled} onChange={changeOption}>
            {
              Array.from(props.options.keys()).map(option => (
                <option value={option}>{option}</option>
              ))}
          </select>
        </Show>
      </div>
    </div>
  );
}
export default SettingDropdown