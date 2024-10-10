import Bar from "../bar/Bar";
import "./styles.css";
import { setVolume, volume } from "@renderer/components/song/song.utils";
import { Component, JSX, Match, mergeProps, Switch } from "solid-js";

const Settings: Component = () => {
  return (
    <div class="settings">
      <SettingsSection title="General" icon="ri-global-line">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, voluptatem.
      </SettingsSection>
      <SettingsSection title="Audio" icon="ri-volume-up-line">
        <GlobalVolumeSetting />
      </SettingsSection>
    </div>
  );
};

type SettingsSectionProps = JSX.IntrinsicElements["div"] & {
  title: string;
  icon: string;
};
const SettingsSection: Component<SettingsSectionProps> = ({ title, icon, children, ...rest }) => {
  return (
    <div {...mergeProps({ class: "settings-section" }, rest)}>
      <div class="settings-section__upper-part">
        <i class={`settings-section__upper-part-icon ${icon}`} />
        <h3 class="settings-section__upper-part-title">{title}</h3>
      </div>

      {children}
    </div>
  );
};

type SettingProps = JSX.IntrinsicElements["div"] & {
  label: string;
  name: string;
};
const Setting: Component<SettingProps> = ({ label, name, children, ...rest }) => {
  return (
    <div {...mergeProps({ class: "setting" }, rest)}>
      <label class="setting__label" for={name}>
        {label}
      </label>
      {children}
    </div>
  );
};

const GlobalVolumeSetting: Component = () => {
  return (
    <Setting name="global-volume" label="Global volume">
      <div class="global-volume-setting">
        <div class="global-volume-setting__icon">
          <Switch>
            <Match when={volume() === 0}>
              <i class="ri-volume-mute-fill" />
            </Match>
            <Match when={volume() < 0.5}>
              <i class="ri-volume-down-fill" />
            </Match>
            <Match when={volume() >= 0.5}>
              <i class="ri-volume-up-fill" />
            </Match>
          </Switch>
        </div>
        <div class="global-volume-setting__bar">
          <Bar fill={volume()} setFill={setVolume} />
        </div>
      </div>
    </Setting>
  );
};

export default Settings;
