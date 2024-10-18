import { cn } from "../../lib/css.utils";
import Bar from "../bar/Bar";
import Dropdown from "../dropdown/Dropdown";
import { changeAudioDevice, setVolume, volume } from "@renderer/components/song/song.utils";
import { Component, createEffect, createSignal, JSX, Match, onMount, Switch } from "solid-js";

const Settings: Component = () => {
  return (
    <div class="flex flex-col gap-10 p-8">
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
    <div class={cn("flex flex-col gap-6", rest.class)}>
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
    <div class={cn("flex flex-col gap-2.5", rest.class)}>
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
        <div class="flex h-4 w-4 items-center justify-center">
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
        <Dropdown.SelectTrigger class="w-full rounded border border-stroke bg-surface px-2 py-1 text-text hover:bg-red focus:outline-none focus:ring-2 focus:ring-accent">
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
