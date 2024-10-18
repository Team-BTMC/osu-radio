import { Optional } from "../../../../@types";
import "../../assets/css/notice/notice.css";
import Impulse from "../../lib/Impulse";
import { none, orDefault, some } from "../../lib/rust-like-utils-client/Optional";
import Gradient from "../Gradient";
import { hideNotice } from "./NoticeContainer";
import { Accessor, Component, createSignal } from "solid-js";

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
  const removeNotice = () => {
    const action = hideNotice(props.notice.id);

    if (action.isError) {
      return;
    }

    try {
      pauseDrain();
    } catch (error) {
      console.error(error);
    }
  };

  const [drain, setDrainTime, pauseDrain] = createDrainAnimation(
    props.notice.timeoutMS ?? 10_000,
    removeNotice,
  );

  const onRef = (notice: HTMLElement) => {
    props.updateGradient.pulse();
    props.onMount(notice);
  };

  return (
    <div
      class={"notice-wrapper"}
      onPointerEnter={pauseDrain}
      onPointerLeave={() => setDrainTime(props.notice.timeoutMS ?? 10_000)}
      data-id={props.notice.id}
      ref={onRef}
    >
      <Gradient update={props.updateGradient}>
        <div class={"notice " + (props.notice.class !== "notice" ? props.notice.class : "")}>
          <div class="content">
            <div class="head">
              <h3>{props.notice.title}</h3>
              <button onClick={removeNotice}>
                <i class="ri-close-line" />
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
