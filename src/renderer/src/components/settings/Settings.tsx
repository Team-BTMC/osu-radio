import { cn } from "../../lib/css.utils";
import Select from "../select/Select";
import { changeAudioDevice } from "@renderer/components/song/song.utils";
import { GlobeIcon, LucideIcon, Volume2Icon } from "lucide-solid";
import { Component, createEffect, createSignal, For, JSX, onMount } from "solid-js";

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

const SettingsSection: Component<SettingsSectionProps> = (props) => {
  return (
    <div class={cn("flex flex-col gap-6", props.class)}>
      <div class="flex items-center gap-3">
        <props.Icon class="text-text opacity-70" size={16} />
        <h3 class="text-base text-text">{props.title}</h3>
      </div>
      {props.children}
    </div>
  );
};

type SettingProps = JSX.IntrinsicElements["div"] & {
  label: string;
  name: string;
};

const Setting: Component<SettingProps> = (props) => {
  return (
    <div class={cn("flex flex-col gap-2.5", props.class)}>
      <label class="text-sm font-semibold text-text" for={props.name}>
        {props.label}
      </label>
      {props.children}
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
      <Select isOpen={isPopoverOpen} onValueChange={setIsPopoverOpen}>
        <Select.Trigger variant="outlined">
          {selectedAudioDevice() || "No device selected"}
        </Select.Trigger>

        <Select.Content value={selectedAudioDevice} onValueChange={handleValueChange}>
          <For each={Array.from(audioDevices().keys())}>
            {(audioDevice) => (
              <Select.Option
                onSelectedByClick={() => {
                  setIsPopoverOpen(false);
                }}
                value={audioDevice}
              >
                {audioDevice}
              </Select.Option>
            )}
          </For>
        </Select.Content>
      </Select>
    </Setting>
  );
};

export default Settings;
