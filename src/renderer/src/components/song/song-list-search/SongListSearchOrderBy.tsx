import Button from "@renderer/components/button/Button";
import Dropdown from "@renderer/components/dropdown/Dropdown";
import { ArrowDownAzIcon, ArrowUpZaIcon } from "lucide-solid";
import { Component, createMemo, createSignal, For, Match, Setter, Switch } from "solid-js";
import { OrderDirection, OrderOptions, Order } from "src/@types";

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
    <div class="flex items-center space-x-3">
      <Button variant={"ghost"} size="icon" onClick={switchDirections}>
        <Switch>
          <Match when={direction() === "asc"}>
            <ArrowDownAzIcon size={20} />
          </Match>
          <Match when={direction() === "desc"}>
            <ArrowUpZaIcon size={20} />
          </Match>
        </Switch>
      </Button>
      <Dropdown>
        <Dropdown.Trigger class="rounded-md bg-thin-material px-3 py-1">
          {optionLabel()}
        </Dropdown.Trigger>
        <Dropdown.List
          onValueChange={(newSelectedOption) => {
            setOption(newSelectedOption as OrderOptions);
            handlerOrderChanged();
          }}
          value={option()}
        >
          <For each={orderOptions}>
            {(option) => (
              <Dropdown.Item
                class="px-4 py-2 transition-colors duration-200 hover:bg-accent/20"
                value={option.value}
              >
                {option.text}
              </Dropdown.Item>
            )}
          </For>
        </Dropdown.List>
      </Dropdown>
    </div>
  );
};

export default SongListSearchOrderBy;
