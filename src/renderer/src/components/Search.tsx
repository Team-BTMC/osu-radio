import { Accessor, Component, createEffect, createSignal, Signal } from 'solid-js';
import "../assets/css/search/search.css";
import { Optional } from '../../../@types';
import { SearchQueryError } from '../../../main/lib/search-parser/@search-types';
import SearchTextBox from './search/SearchTextBox';
import Fa from 'solid-fa';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { globalIconScale } from '../App';



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
          <button class="tags">
            <Fa icon={faTags} scale={globalIconScale}/>
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