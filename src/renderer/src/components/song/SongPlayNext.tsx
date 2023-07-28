import { Component, createSignal, Show } from 'solid-js';
import { Song } from '../../../../@types';



type SongPlayNextProps = {
  path: Song["path"]
}



const SongPlayNext: Component<SongPlayNextProps> = props => {
  const [show, setShow] = createSignal(false);
  const divAccessor = (div: HTMLElement) => {
    div.addEventListener("click", async () => {
      await window.api.request('queue::playNext', props.path);
    });
  }



  window.api.listen("queue::created", () => {
    setShow(true);
  });

  window.api.listen("queue::destroyed", () => {
    setShow(false);
  });



  return (
    <Show when={show()}>
      <div ref={divAccessor}>Play Next</div>
    </Show>
  );
};



export default SongPlayNext;