import List from "@renderer/components/list/List";
import { SortAsc, SortDesc } from "lucide-solid";
import { Component, createMemo, createSignal, For, Match, Setter, Switch } from "solid-js";
import { OrderDirection, OrderOptions, Order } from "src/@types";
import FilterOption from "./FilterOption";

type OrderOption = {
  text: string;
  value: OrderOptions;
};

const orderOptions = [
  {
    value: "title",
    text: "Title",
  },
  {
    value: "artist",
    text: "Artist",
  },
  {
    value: "creator",
    text: "Creator",
  },
  {
    value: "bpm",
    text: "BPM",
  },
  {
    value: "duration",
    text: "Length",
  },
  {
    value: "dateAdded",
    text: "Date Added",
  },
] satisfies OrderOption[];

type OrderSelectProps = {
  setOrder: Setter<Order>;
  disabled?: boolean;
};

const SongListSearchOrderBy: Component<OrderSelectProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [option, setOption] = createSignal<OrderOptions>("title");
  const [direction, setDirection] = createSignal<OrderDirection>("asc");

  const handlerOrderChanged = () => {
    props.setOrder({ option: option(), direction: direction() });
  };

  const switchDirections = () => {
    setDirection((d) => (d === "asc" ? "desc" : "asc"));
    handlerOrderChanged();
  };

  const optionLabel = createMemo(() => {
    const o = option();
    return orderOptions.find((option) => option.value === o)?.text ?? "";
  });

  return (
    <FilterOption
      class="flex-shrink-0"
      popoverProps={{
        isOpen,
        onValueChange: setIsOpen,
      }}
    >
      <FilterOption.Label>Sort by</FilterOption.Label>
      <FilterOption.List>
        <FilterOption.Item class="text-subtext" onClick={switchDirections}>
          <div class="p-0.5">
            <Switch>
              <Match when={direction() === "asc"}>
                <SortAsc size={16} />
              </Match>
              <Match when={direction() === "desc"}>
                <SortDesc size={16} />
              </Match>
            </Switch>
          </div>
        </FilterOption.Item>
        <div class="h-4 w-px bg-stroke" />
        <FilterOption.Trigger>{optionLabel()}</FilterOption.Trigger>
      </FilterOption.List>

      <FilterOption.Content class="w-48">
        <List
          onValueChange={(newSelectedOption) => {
            setOption(newSelectedOption as OrderOptions);
            handlerOrderChanged();
          }}
          value={option}
        >
          <For each={orderOptions}>
            {(option) => (
              <List.Item onSelectedByClick={() => setIsOpen(false)} value={option.value}>
                {option.text}
              </List.Item>
            )}
          </For>
        </List>
      </FilterOption.Content>
    </FilterOption>
  );
};

export default SongListSearchOrderBy;
