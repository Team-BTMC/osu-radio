import { Component, createEffect, onMount, Signal } from 'solid-js';



export type SearchProps = {
  query: Signal<string>
}

const Search: Component<SearchProps> = props => {
  const [query, setQuery] = props.query;
  let editable;

  const input = evt => {
    setQuery(evt.target.textContent ?? "");
  }

  onMount(() => {
    editable.textContent = query();
  });

  createEffect(() => {
    if (editable.textContent === query()) {
      return;
    }

    editable.textContent = query();
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

export default Search