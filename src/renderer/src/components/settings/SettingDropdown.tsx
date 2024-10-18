import { Component, Show } from "solid-js";

type SettingDropdownProps = {
  label: string;
  options: Map<string, () => any>;
  disabled: false;
};

const SettingDropdown: Component<SettingDropdownProps> = (props) => {
  const changeOption = (e: Event) => {
    const option = (e.target as HTMLSelectElement).value;
    const functionToCall = props.options.get(option);
    if (functionToCall !== undefined) {
      functionToCall();
    }
  };

  return (
    <div class="mb-2.5 flex items-center justify-between">
      <label class="text-sm font-semibold text-text">{props.label}</label>
      <Show
        when={props.options.size > 0}
        fallback={<div class="text-sm text-subtext">Loading audio devices</div>}
      >
        <select
          class="w-1/2 rounded border border-stroke bg-surface px-2 py-1 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={props.disabled}
          onChange={changeOption}
        >
          {Array.from(props.options.keys()).map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </Show>
    </div>
  );
};

export default SettingDropdown;
