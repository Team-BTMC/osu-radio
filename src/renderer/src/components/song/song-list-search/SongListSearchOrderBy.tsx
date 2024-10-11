import Dropdown from "@renderer/components/dropdown/Dropdown";
import IconButton from "@renderer/components/icon-button/IconButton";
import { Component, createMemo, createSignal, Match, Setter, Switch } from "solid-js";

type OrderOption = {
  text: string;
  value: string;
};

type OrderDirection = "asc" | "desc";
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
  setOrder: Setter<string>;
  disabled?: boolean;
};

const SongListSearchOrderBy: Component<OrderSelectProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [option, setOption] = createSignal("title");
  const [direction, setDirection] = createSignal<OrderDirection>("asc");

  const handlerOrderChanged = () => {
    const o = option();
    const d = direction();
    props.setOrder(`${o}:${d}`);
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
    <div class="flex items-center space-x-2">
      <IconButton class="text-xl" onClick={switchDirections}>
        <Switch>
          <Match when={direction() === "asc"}>
            <i class="ri-sort-asc" />
          </Match>
          <Match when={direction() === "desc"}>
            <i class="ri-sort-desc" />
          </Match>
        </Switch>
      </IconButton>
      <Dropdown isOpen={isOpen} onValueChange={setIsOpen}>
        <Dropdown.Trigger class="px-3 py-1 bg-thin-material rounded-md">
          {optionLabel()}
        </Dropdown.Trigger>
        <Dropdown.List
          class="bg-surface shadow-lg rounded-md overflow-hidden"
          onValueChange={(newSelectedOption) => {
            setIsOpen(false);
            setOption(newSelectedOption);
            handlerOrderChanged();
          }}
          value={option}
        >
          {orderOptions.map((option) => (
            <Dropdown.Item
              class="px-4 py-2 hover:bg-accent/20 transition-colors duration-200"
              value={option.value}
            >
              {option.text}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown>
    </div>
  );
};

export default SongListSearchOrderBy;
