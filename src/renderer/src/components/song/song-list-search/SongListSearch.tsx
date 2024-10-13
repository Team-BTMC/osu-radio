import { Optional } from "../../../../../@types";
import { SearchQueryError } from "../../../../../main/lib/search-parser/@search-types";
import { Tag } from "../../search/TagSelect";
import { setSongsSearch } from "../song-list/song-list.utils";
import SongListSearchOrderBy from "./SongListSearchOrderBy";
import SongListSearchTags, { TagMode } from "./SongListSearchTags";
import "./styles.css";
import { Accessor, Component, createSignal, Setter } from "solid-js";

export type SearchProps = {
  count: Accessor<number>;
  error: Accessor<Optional<SearchQueryError>>;
  setOrder: Setter<string>;
  setTags: Setter<Tag[]>;
};

const SongListSearch: Component<SearchProps> = (props) => {
  const [selectedTags, setSelectedTags] = createSignal(new Map<string, TagMode>());

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

  const handleValueChange = (tags: Map<string, TagMode>) => {
    setSelectedTags(tags);

    const searchFormattedTags = Array.from(
      tags.entries(),
      ([tagName, mode]): Tag => ({
        name: tagName,
        isSpecial: mode === "discart",
      }),
    );
    props.setTags(searchFormattedTags);
  };

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
          <i class="ri-search-2-line" />
        </label>
      </div>

      <div class="song-list-search__filters">
        <SongListSearchOrderBy setOrder={props.setOrder} />
        <SongListSearchTags value={selectedTags} onValueChange={handleValueChange} />
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
