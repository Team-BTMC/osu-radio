import Button from "../button/Button";
import { hideNotice } from "./NoticeContainer";
import { XIcon } from "lucide-solid";
import { Component, createSignal } from "solid-js";

export type NoticeType = {
  id?: string;
  class: "notice" | "success" | "error";
  title: string;
  content: string;
  active?: boolean;
};

type NoticeProps = {
  notice: NoticeType;
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
    props.onMount(notice);
    setTimeout(() => setIsVisible(true), 50); // Delay to trigger enter animation
    setTimeout(removeNotice, NOTICE_DURATION);
  };

  return (
    <div
      class={`group transform overflow-hidden rounded-xl border border-stroke bg-thick-material p-4 shadow-2xl transition-all duration-300 ease-in-out ${
        isVisible() ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      data-id={props.notice.id}
      ref={onRef}
    >
      <Button
        variant="outlined"
        size="icon"
        onClick={removeNotice}
        class="absolute right-3 top-3 size-7 p-1 text-subtext opacity-0 group-hover:opacity-100"
      >
        <XIcon size={16} />
      </Button>

      <div class="mr-6">
        <h3 class="mb-1 text-lg font-semibold">{props.notice.title}</h3>
        <p class="text-sm text-subtext">{props.notice.content}</p>
      </div>

      <div
        class="absolute bottom-0 left-0 h-0.5 rounded-full bg-accent transition-all ease-linear"
        style={{
          animation: `shrinkWidth ${NOTICE_DURATION}ms linear forwards`,
        }}
      ></div>
    </div>
  );
};

export default Notice;
