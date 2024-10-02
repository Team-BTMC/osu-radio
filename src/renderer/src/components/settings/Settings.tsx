import {
  faGlobe,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import Fa from "solid-fa";
import { Component, JSX, Match, mergeProps, Switch } from "solid-js";
import Bar from "../bar/Bar";
import { setVolume, volume } from "@renderer/lib/state/song";
import "./styles.css";

const Settings: Component = () => {
  return (
    <div class="settings">
      <SettingsSection title="General" icon={faGlobe}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, voluptatem.
      </SettingsSection>
      <SettingsSection title="Audio" icon={faVolumeHigh}>
        <GlobalVolumeSetting />
      </SettingsSection>
    </div>
  );
};

type SettingsSectionProps = JSX.IntrinsicElements["div"] & {
  title: string;
  icon: IconDefinition;
};
const SettingsSection: Component<SettingsSectionProps> = ({ title, icon, children, ...rest }) => {
  return (
    <div {...mergeProps({ class: "settings-section" }, rest)}>
      <div class="settings-section__upper-part">
        <Fa class="settings-section__upper-part-icon" icon={icon} />
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
              <Fa icon={faVolumeXmark} />
            </Match>
            <Match when={volume() < 0.5}>
              <Fa icon={faVolumeLow} />
            </Match>
            <Match when={volume() >= 0.5}>
              <Fa icon={faVolumeHigh} />
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
