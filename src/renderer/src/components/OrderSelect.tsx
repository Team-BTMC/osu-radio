import { Component, createEffect, createSignal, Setter, Show } from "solid-js";
import Select, { SelectOption } from "./Select";
import Fa from "solid-fa";
import {
  faArrowDown19,
  faArrowDown91,
  faArrowDownAZ,
  faArrowDownZA
} from "@fortawesome/free-solid-svg-icons";
import { GLOBAL_ICON_SCALE } from "../App";

type OrderOption = SelectOption & {
  type: "number" | "string";
};

type OrderDirection = "asc" | "desc";

const orderOptions: OrderOption[] = [
  {
    value: "title",
    text: "Title",
    type: "string"
  },
  {
    value: "artist",
    text: "Artist",
    type: "string"
  },
  {
    value: "creator",
    text: "Creator",
    type: "string"
  },
  {
    value: "bpm",
    text: "BPM",
    type: "number"
  },
  {
    value: "duration",
    text: "Length",
    type: "number"
  },
  {
    value: "dateAdded",
    text: "Date Added",
    type: "number"
  }
];

type OrderSelectProps = {
  setOrder: Setter<string>;
  disabled?: boolean;
};

const OrderSelect: Component<OrderSelectProps> = (props) => {
  const [option, setOption] = createSignal("title");
  const [selected, setSelected] = createSignal(orderOptions[0]);
  const [direction, setDirection] = createSignal<OrderDirection>("asc");

  createEffect(() => {
    const o = option();
    const s = orderOptions.find((opt) => opt.value === o);

    if (s === undefined) {
      return;
    }

    setSelected(s);
  });

  createEffect(() => {
    const o = option();
    const d = direction();

    props.setOrder(`${o}:${d}`);
  });

  const switchDirections = () => {
    const d = direction();

    if (d === "asc") {
      setDirection("desc");
      return;
    }

    setDirection("asc");
  };

  return (
    <>
      <Select setValue={setOption} options={orderOptions} disabled={props.disabled} />
      <button
        class={"hint"}
        onClick={switchDirections}
        disabled={props.disabled}
        title={direction() === "asc" ? "Ascending" : "Descending"}
      >
        <Show
          when={selected().type === "string"}
          fallback={
            <Show
              when={direction() === "asc"}
              fallback={<Fa icon={faArrowDown91} scale={GLOBAL_ICON_SCALE} />}
            >
              <Fa icon={faArrowDown19} scale={GLOBAL_ICON_SCALE} />
            </Show>
          }
        >
          <Show
            when={direction() === "asc"}
            fallback={<Fa icon={faArrowDownZA} scale={GLOBAL_ICON_SCALE} />}
          >
            <Fa icon={faArrowDownAZ} scale={GLOBAL_ICON_SCALE} />
          </Show>
        </Show>
      </button>
    </>
  );
};

export default OrderSelect;
