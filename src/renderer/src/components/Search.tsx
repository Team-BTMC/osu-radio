import { Accessor, Component, createEffect, createSignal, onMount, Signal } from 'solid-js';
import "../assets/css/search.css";
import { Optional } from '../../../@types';
import { SearchQueryError } from '../../../main/lib/search-parser/@search-types';



export type SearchProps = {
  query: Signal<string>,
  count: Accessor<number>,
  error: Accessor<Optional<SearchQueryError>>
}

const Search: Component<SearchProps> = props => {
  const [query, setQuery] = props.query;
  const [doShowError, setDoShowError] = createSignal(false);
  const [doShowSuggestion, setDoShowSuggestion] = createSignal(false);
  let editable, errorMessage, suggestion;

  const onInput = () => {
    setQuery(editable.textContent ?? "");
  }

  const onPaste = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    editable.textContent = evt.clipboardData.getData("Text");
    onInput();
  }

  onMount(() => {
    editable.textContent = query();
  });

  createEffect(() => {
    const opt = props.error();

    if (opt.isNone === true) {
      setDoShowError(false);
      return;
    }

    setDoShowError(true);
    const error = opt.value.error;

    errorMessage.textContent = error.message;

    if (error.suggestion !== undefined) {
      setDoShowSuggestion(true);
      suggestion.textContent = error.suggestion.description;
      suggestion.onclick = () => {
        editable.textContent = opt.value.query.substring(0, error.start) + error.suggestion?.fullReplacement + opt.value.query.substring(error.end);
        onInput();
      }
    } else {
      setDoShowSuggestion(false);
      suggestion.onclick = () => {};
    }
  });

  return (
    <div class="search no-pd">
      <div>
        <div class="input button-like">
          <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z" fill="currentColor"/>
          </svg>
          <div class="editable" ref={editable} onInput={onInput} onPaste={onPaste} contenteditable={true} spellcheck={false}></div>
          <button class="icon">✕</button>
        </div>
      </div>

      <div class="results row">
        <button title="Save results as playlist">{props.count()} results</button>
        <div class="row">
          <button>Title (A-Z)</button>
          <button class="tag">
            <svg width="24" height="24" version="1.1" id="Vrstva_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;">
              <path fill="currentColor" d="M453.7,282.5l-31.8-31.8L410,238.8L248.9,77.7c-3.4-4.8-8.9-7.9-15.2-7.9H87.6c-10.3,0-18.7,8.4-18.7,18.7v146.1
                c0,6.3,3.1,11.8,7.9,15.2l159,159c0.6,0.8,1.2,1.6,1.9,2.3l43.7,43.7c7.2,7.2,18.9,7.2,26.1,0l146.2-146.2
                C460.9,301.4,460.9,289.7,453.7,282.5z M125.8,189.4c-17.3-17.3-17.3-45.4,0-62.7c17.3-17.3,45.4-17.3,62.7,0
                c17.3,17.3,17.3,45.4,0,62.7C171.1,206.7,143.1,206.7,125.8,189.4z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="error-container" classList={{ 'display-none': !doShowError() }}>
        <p class="message" ref={errorMessage}></p>
        <button class="suggestion" ref={suggestion} classList={{ 'display-none': !doShowSuggestion() }}></button>
      </div>
    </div>
  );
}

export default Search;