import { Accessor, Component, createEffect, createSignal, Signal } from 'solid-js';
import "../assets/css/search/search.css";
import { Optional } from '../../../@types';
import { SearchQueryError } from '../../../main/lib/search-parser/@search-types';
import SearchTextBox from './search/SearchTextBox';



export type SearchProps = {
  query: Signal<string>,
  count: Accessor<number>,
  error: Accessor<Optional<SearchQueryError>>
}

const Search: Component<SearchProps> = props => {
  const [_, setQuery] = props.query;
  const [editable, setEditable] = createSignal<HTMLElement | undefined>();
  const [doShowError, setDoShowError] = createSignal(false);
  const [doShowSuggestion, setDoShowSuggestion] = createSignal(false);
  let errorMessage, suggestion;

  const onInput = () => {
    const e = editable();
    if (e === undefined || e.textContent === null) {
      return;
    }

    setQuery(e.textContent.replaceAll(String.fromCharCode(160), String.fromCharCode(32)) ?? "");
  }

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
        const e = editable();
        if (e === undefined) {
          return;
        }

        e.textContent = opt.value.query.substring(0, error.start) + error.suggestion?.fullReplacement + opt.value.query.substring(error.end);
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
        <SearchTextBox value={props.query} setInput={setEditable}/>
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