import Impulse from "../../lib/Impulse";
import Gradient from "../Gradient";
import { hideNotice } from "./NoticeContainer";
import { XIcon } from "lucide-solid";
import { Component, createSignal } from "solid-js";

export type NoticeType = {
  id?: string;
  class: "notice" | "warning" | "error";
  title: string;
  content: string;
  active?: boolean;
};

type NoticeProps = {
  notice: NoticeType;
  updateGradient: Impulse;
  onMount: (notice: HTMLElement) => any;
};

const NOTICE_DURATION = 3000; // 3 seconds

const Notice: Component<NoticeProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  const removeNotice = () => {
    setIsVisible(false);
    setTimeout(() => {
      const action = hideNotice(props.notice.id);
      if (action.isError) {
        return;
      }
    }, 300); // Wait for fade out animation
  };

  const onRef = (notice: HTMLElement) => {
    props.updateGradient.pulse();
    props.onMount(notice);
    setTimeout(() => setIsVisible(true), 50); // Delay to trigger enter animation
    setTimeout(removeNotice, NOTICE_DURATION);
  };

  return (
    <div
      class={`transform transition-all duration-300 ease-in-out ${
        isVisible() ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      data-id={props.notice.id}
      ref={onRef}
    >
      <Gradient update={props.updateGradient}>
        <div class="relative rounded-lg p-4 shadow-lg transition-transform hover:scale-105">
          <button
            onClick={removeNotice}
            class="absolute left-2 top-2 text-subtext transition-colors hover:text-text"
          >
            <XIcon size={20} />
          </button>

          <div class="ml-6">
            <h3 class="mb-1 text-lg font-semibold">{props.notice.title}</h3>
            <p class="text-sm text-subtext">{props.notice.content}</p>
          </div>

          <div
            class="absolute bottom-0 left-0 h-1 bg-accent transition-all ease-linear"
            style={{
              animation: `shrinkWidth ${NOTICE_DURATION}ms linear forwards`,
            }}
          ></div>
        </div>
      </Gradient>
    </div>
  );
};

export default Notice;
