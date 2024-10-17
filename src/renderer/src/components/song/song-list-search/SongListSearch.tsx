import { Optional, Order } from "../../../../../@types";
import { SearchQueryError } from "../../../../../main/lib/search-parser/@search-types";
import { Tag } from "../../search/TagSelect";
import { setSongsSearch } from "../song-list/song-list.utils";
import SongListSearchOrderBy from "./SongListSearchOrderBy";
import { SearchIcon } from "lucide-solid";
import { Accessor, Component, Setter, Signal } from "solid-js";

export type SearchProps = {
  tags: Signal<Tag[]>;
  count: Accessor<number>;
  error: Accessor<Optional<SearchQueryError>>;
  setOrder: Setter<Order>;
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
    <div class="p-5">
      <div class="relative mb-4">
        <input
          class="h-10 w-full rounded-full bg-thin-material pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
          type="text"
          id="search_input"
          placeholder="Type to search songs..."
          onInput={(e) => {
            setSongsSearch(e.target.value);
          }}
        />
        <label
          class="absolute left-3 top-1/2 -translate-y-1/2 transform text-text"
          for="search_input"
        >
          <SearchIcon size={20} class="opacity-70" />
        </label>
      </div>

      <div class="flex items-center space-x-4">
        <SongListSearchOrderBy setOrder={props.setOrder} />
      </div>
    </div>
  );
};

{
  /* <div class="results row">
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
      </div> */
}

{
  /* <div class="error-container" classList={{ 'display-none': !doShowError() }}>
        <p class="message" ref={errorMessage}></p>
        <button class="suggestion" ref={suggestion} classList={{ 'display-none': !doShowSuggestion() }}></button>
      </div> */
}

export default SongListSearch;
