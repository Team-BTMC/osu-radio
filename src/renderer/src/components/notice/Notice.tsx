import { Optional } from "../../../../@types";
import Impulse from "../../lib/Impulse";
import { none, orDefault, some } from "../../lib/rust-like-utils-client/Optional";
import Gradient from "../Gradient";
import { hideNotice } from "./NoticeContainer";
import { XIcon } from "lucide-solid";
import { Accessor, Component, createSignal, onMount } from "solid-js";

export type NoticeType = {
  id?: string;
  class: "notice" | "warning" | "error";
  title: string;
  content: string;
  timeoutMS?: number;
  active?: boolean;
};

type NoticeProps = {
  notice: NoticeType;
  updateGradient: Impulse;
  onMount: (notice: HTMLElement) => any;
};

const Notice: Component<NoticeProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  const removeNotice = () => {
    setIsVisible(false);
    setTimeout(() => {
      const action = hideNotice(props.notice.id);
      if (action.isError) {
        return;
      }
      try {
        pauseDrain();
      } catch {}
    }, 300); // Wait for fade out animation
  };

  const [drain, setDrainTime, pauseDrain] = createDrainAnimation(
    props.notice.timeoutMS ?? 3000, // 3 seconds
    removeNotice,
  );

  const onRef = (notice: HTMLElement) => {
    props.updateGradient.pulse();
    props.onMount(notice);
    setTimeout(() => setIsVisible(true), 50); // Delay to trigger enter animation
  };

  onMount(() => {
    setDrainTime(props.notice.timeoutMS ?? 10_000);
  });

  return (
    <div
      class={`transform transition-all duration-300 ease-in-out ${
        isVisible() ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      onPointerEnter={pauseDrain}
      onPointerLeave={() => setDrainTime(props.notice.timeoutMS ?? 10_000)}
      data-id={props.notice.id}
      ref={onRef}
    >
      <Gradient update={props.updateGradient}>
        <div
          class={`${props.notice.class !== "notice" ? props.notice.class : ""} transition-transform hover:scale-105`}
        >
          <div class="content">
            <div class="head">
              <h3>{props.notice.title}</h3>
              <button onClick={removeNotice}>
                <XIcon size={20} />
              </button>
            </div>

            <p>{props.notice.content}</p>
          </div>

          <div
            class="timeout"
            classList={{
              pause: drain().isNone,
            }}
            style={{
              animation: orDefault(drain(), undefined),
            }}
          ></div>
        </div>
      </Gradient>
    </div>
  );
};

function createDrainAnimation(
  timeMS: number,
  onDrained: () => any,
): [Accessor<Optional<string>>, (timeMS: number) => any, () => any] {
  const [get, set] = createSignal<Optional<string>>(some(drainTemplate(timeMS)));

  let timeout = window.setTimeout(onDrained, timeMS);

  return [
    get,
    (ms: number) => {
      set(some(drainTemplate(ms)));
      clearTimeout(timeout);
      timeout = window.setTimeout(onDrained, ms);
    },
    () => {
      set(none());
      clearTimeout(timeout);
    },
  ];
}

function drainTemplate(timeMS: number): string {
  return `drain-time ${Math.round(timeMS)}ms linear forwards`;
}

export default Notice;
