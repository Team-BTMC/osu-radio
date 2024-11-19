import SongListSearchOrderBy from "./SongListSearchOrderBy";
import { SongListSearchTags } from "./SongListSearchTags";
import Button from "@renderer/components/button/Button";
import { Input } from "@renderer/components/input/Input";
import { setSongsSearch } from "@renderer/components/song/song-list/song-list.utils";
import { Optional, Order, Tag } from "@shared/types/common.types";
import { SearchQueryError } from "@shared/types/search-parser.types";
import { FilterIcon, SearchIcon, FilterXIcon } from "lucide-solid";
import { Accessor, Component, createSignal, Match, Setter, Signal, Switch } from "solid-js";

export type SearchProps = {
  tags: Signal<Tag[]>;
  count: Accessor<number>;
  error: Accessor<Optional<SearchQueryError>>;
  setOrder: Setter<Order>;
};

const SongListSearch: Component<SearchProps> = (props) => {
  const [filterExpanded, setFilterExpanded] = createSignal(false);

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
    <div class="px-5 pb-2 pt-1">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Input
            variant="outlined"
            type="text"
            id="search_input"
            placeholder="Type to search songs..."
            onInput={(e) => {
              setSongsSearch(e.target.value);
            }}
          />
          <label
            class="absolute right-3.5 top-1/2 -translate-y-1/2 transform text-subtext"
            for="search_input"
          >
            <SearchIcon size={20} class="opacity-70" />
          </label>
        </div>
        <Button
          onClick={() => setFilterExpanded((e) => !e)}
          size="square"
          variant={filterExpanded() ? "secondary" : "outlined"}
        >
          <Switch>
            <Match when={filterExpanded()}>
              <FilterXIcon size={20} />
            </Match>
            <Match when={!filterExpanded()}>
              <FilterIcon size={20} />
            </Match>
          </Switch>
        </Button>
      </div>
      <div
        class="overflow-hidden transition-all"
        classList={{
          "h-0": !filterExpanded(),
          "h-[46px]": filterExpanded(),
        }}
      >
        <div class="mt-2 flex flex-nowrap items-center gap-2 overflow-y-auto">
          <SongListSearchOrderBy disabled={!filterExpanded()} setOrder={props.setOrder} />
          <SongListSearchTags disabled={!filterExpanded()} />
        </div>
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
