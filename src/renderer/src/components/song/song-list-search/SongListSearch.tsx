import { Accessor, Component, createEffect, createSignal, Setter, Signal } from "solid-js";
import { Optional } from "../../../../../@types";
import { SearchQueryError } from "../../../../../main/lib/search-parser/@search-types";
import Fa from "solid-fa";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { GLOBAL_ICON_SCALE } from "../../../App";
import TagSelect, { Tag } from "../../search/TagSelect";
import OrderSelect from "../../OrderSelect";

import "./styles.css";
import { setSongsSearch } from "@renderer/lib/state/song-list";
import DropdownTrigger from "@renderer/components/dropdown-trigger/DropdownTrigger";

export type SearchProps = {
  tags: Signal<Tag[]>;
  count: Accessor<number>;
  error: Accessor<Optional<SearchQueryError>>;
  setOrder: Setter<string>;
};

const SongListSearch: Component<SearchProps> = (props) => {
  // const [editable, setEditable] = createSignal<HTMLElement | undefined>();
  // const [doShowError, setDoShowError] = createSignal(false);
  // const [doShowSuggestion, setDoShowSuggestion] = createSignal(false);
  // let errorMessage, suggestion;

  // const onInput = () => {
  //   const e = editable();
  //   if (e === undefined || e.textContent === null) {
  //     return;
  //   }

  //   setQuery(e.textContent.replaceAll(String.fromCharCode(160), String.fromCharCode(32)) ?? "");
  // };

  // createEffect(() => {
  //   const opt = props.error();

  //   if (opt.isNone === true) {
  //     setDoShowError(false);
  //     return;
  //   }

  //   setDoShowError(true);
  //   const error = opt.value.error;

  //   errorMessage.textContent = error.message;

  //   if (error.suggestion !== undefined) {
  //     setDoShowSuggestion(true);
  //     suggestion.textContent = error.suggestion.description;
  //     suggestion.onclick = () => {
  //       const e = editable();
  //       if (e === undefined) {
  //         return;
  //       }

  //       e.textContent =
  //         opt.value.query.substring(0, error.start) +
  //         error.suggestion?.fullReplacement +
  //         opt.value.query.substring(error.end);
  //       onInput();
  //     };
  //   } else {
  //     setDoShowSuggestion(false);
  //     suggestion.onclick = () => {};
  //   }
  // });

  return (
    <div class="song-list-search">
      <div class="song-list-search__input-container">
        <input
          class="song-list-search__input"
          type="text"
          id="search_input"
          placeholder="Type to search songs..."
          onInput={(e) => {
            setSongsSearch(e.target.value);
          }}
        />
        <label class="song-list-search__icon-container" for="search_input">
          <Fa icon={faSearch} scale={GLOBAL_ICON_SCALE} />
        </label>
      </div>

      <div class="song-list-search__filters">
        <DropdownTrigger>Title</DropdownTrigger>
        <DropdownTrigger>All musics</DropdownTrigger>
        <DropdownTrigger>Tags</DropdownTrigger>
      </div>

      {/* <div class="results row">
        <button
          title={
            props.count() === 0 ? "Can not save results as playlist" : "Save results as playlist"
          }
          disabled={props.count() === 0}
        >
          {props.count()} songs
        </button>
        <div class="row">
          <OrderSelect setOrder={props.setOrder} disabled={props.count() === 0} />
          <TagSelect tags={props.tags} disabled={props.count() === 0} />
        </div>
      </div> */}

      {/* <div class="error-container" classList={{ 'display-none': !doShowError() }}>
        <p class="message" ref={errorMessage}></p>
        <button class="suggestion" ref={suggestion} classList={{ 'display-none': !doShowSuggestion() }}></button>
      </div> */}
    </div>
  );
};

export default SongListSearch;
