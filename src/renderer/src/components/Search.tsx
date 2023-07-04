import { createEffect, createSignal, onMount } from 'solid-js';



export const [searchQuery, setSearchQuery] = createSignal("");



export default function Search() {
  let editable;

  const input = evt => {
    setSearchQuery(evt.target.textContent ?? "");
  }

  onMount(() => {
    editable.textContent = searchQuery();
  });

  createEffect(() => {
    if (editable.textContent === searchQuery()) {
      return;
    }

    editable.textContent = searchQuery();
    const selection = getSelection();
    if (selection === null) {
      return;
    }

    const r = new Range();
    const text = editable.childNodes[0];
    r.setStart(text, text.textContent);
    selection.removeAllRanges();
    selection.addRange(r);
  });

  return (
    <div class="search" onInput={input}>
      <div class={"search-input"} ref={editable} contenteditable={true}></div>
    </div>
  );
}