import Bar from "../bar/Bar";
import Dropdown from "../dropdown/Dropdown";
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
    <div class="p-8 flex flex-col gap-10">
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
    <div {...mergeProps({ class: "flex flex-col gap-6" }, rest)}>
      <div class="flex items-center gap-3">
        <i class={`text-subtext ${icon}`} />
        <h3 class="text-base text-text">{title}</h3>
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
    <div {...mergeProps({ class: "flex flex-col gap-2.5" }, rest)}>
      <label class="text-sm font-semibold text-text" for={name}>
        {label}
      </label>
      {children}
    </div>
  );
};

const GlobalVolumeSetting: Component = () => {
  return (
    <Setting name="global-volume" label="Global volume">
      <div class="flex items-center gap-3">
        <div class="w-4 h-4 flex items-center justify-center">
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
        <div class="flex-1">
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
        <Dropdown.SelectTrigger class="w-full bg-surface text-text border border-stroke rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent">
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