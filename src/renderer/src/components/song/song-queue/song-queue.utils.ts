import { createSignal } from "solid-js";

const DEFAULT_SONG_QUEUE_MODAL_OPEN = false;
const [songQueueModalOpen, setSongQueueModalOpen] = createSignal(DEFAULT_SONG_QUEUE_MODAL_OPEN);

function toggleSongQueueModalOpen() {
  setSongQueueModalOpen((o) => !o);
}

export { songQueueModalOpen, setSongQueueModalOpen, toggleSongQueueModalOpen };
