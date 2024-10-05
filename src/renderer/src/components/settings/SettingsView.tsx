import SettingDropdown from './SettingDropdown';
import "../../assets/css/settings/settings-view.css";
import "../../assets/css/settings/settings-item.css";
import { createEffect, createSignal, onMount } from 'solid-js';
import { changeAudioDevice} from '../../lib/Music';

const SettingsView = () => {
  let view;

  const [audioDevices, setAudioDevices] = createSignal(new Map<string, ()=>any>());

  const setAudioDevicesMap = () => {
    const audioMap = new Map<string, ()=>any>();
    navigator.mediaDevices.enumerateDevices().then(r => {
      for (const device of r) {
        if (device.kind === "audiooutput") {
          audioMap.set(device.label, () => changeAudioDevice(device.deviceId));
        }
      }
      setAudioDevices(audioMap);
    });
  }

  onMount(() => {
    createEffect(setAudioDevicesMap);
  })

  return (
    <div
      ref={view}
      class="settings-view"
    >
      <div class="list">
        <SettingDropdown
          disabled={false}
          label={"Choose audio device"}
          options={audioDevices()}/>
      </div>
    </div>
  )
}
export default SettingsView;
