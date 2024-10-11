import Bar from "../bar/Bar";
import Dropdown from "../dropdown/Dropdown";
import "./styles.css";
import { changeAudioDevice, setVolume, volume } from "@renderer/components/song/song.utils";
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  Match,
  mergeProps,
  onMount,
  Switch,
} from "solid-js";

const Settings: Component = () => {
  return (
    <div class="settings">
      <SettingsSection title="General" icon="ri-global-line">
        Empty
      </SettingsSection>
      <SettingsSection title="Audio" icon="ri-volume-up-line">
        <AudioDeviceSetting />
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

const AudioDeviceSetting: Component = () => {
  const [isPopoverOpen, setIsPopoverOpen] = createSignal(false);
  const [selectedAudioDevice, setSelectedAudioDevice] = createSignal("");
  const [audioDevices, setAudioDevices] = createSignal(new Map<string, () => any>());

  const setAudioDevicesMap = () => {
    const audioMap = new Map<string, () => any>();
    navigator.mediaDevices.enumerateDevices().then((r) => {
      for (const device of r) {
        if (device.kind === "audiooutput") {
          audioMap.set(device.label, () => changeAudioDevice(device.deviceId));
        }
      }
      setAudioDevices(audioMap);
    });
  };

  onMount(() => {
    createEffect(setAudioDevicesMap);
  });

  const handleValueChange = (newSelectedOption: string) => {
    setSelectedAudioDevice(newSelectedOption);
    setIsPopoverOpen(false);
    audioDevices().get(newSelectedOption)?.();
  };

  return (
    <Setting name="audio-device" label="Choose audio device">
      <Dropdown isOpen={isPopoverOpen} onValueChange={setIsPopoverOpen}>
        <Dropdown.SelectTrigger>
          {selectedAudioDevice() || "No device selected"}
        </Dropdown.SelectTrigger>

        <Dropdown.List value={selectedAudioDevice} onValueChange={handleValueChange}>
          {Array.from(audioDevices().keys()).map((audioDevice) => (
            <Dropdown.Item value={audioDevice}>{audioDevice}</Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown>
    </Setting>
  );
};

export default Settings;
