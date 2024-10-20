import { cn } from "../../lib/css.utils";
import Dropdown from "../dropdown/Dropdown";
import { changeAudioDevice } from "@renderer/components/song/song.utils";
import { GlobeIcon, LucideIcon, Volume2Icon } from "lucide-solid";
import { Component, createEffect, createSignal, JSX, onMount } from "solid-js";

const Settings: Component = () => {
  return (
    <div class="flex flex-col gap-10 px-5 py-8">
      <SettingsSection title="General" Icon={GlobeIcon}>
        Empty
      </SettingsSection>
      <SettingsSection title="Audio" Icon={Volume2Icon}>
        <AudioDeviceSetting />
      </SettingsSection>
    </div>
  );
};

type SettingsSectionProps = JSX.IntrinsicElements["div"] & {
  title: string;
  Icon: LucideIcon;
};

const SettingsSection: Component<SettingsSectionProps> = ({ title, Icon, children, ...rest }) => {
  return (
    <div class={cn("flex flex-col gap-6", rest.class)}>
      <div class="flex items-center gap-3">
        <Icon class="text-text opacity-70" size={16} />
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
            <Dropdown.Item
              onSelectedByClick={() => {
                setIsPopoverOpen(false);
              }}
              value={audioDevice}
            >
              {audioDevice}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown>
    </Setting>
  );
};

export default Settings;
