import Button from "../button/Button";
import { hideNotice } from "./NoticeContainer";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
import { Component, createSignal, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

const noticeStyles = cva(
  [
    "group transform overflow-hidden rounded-xl border border-stroke bg-thick-material p-4 shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-md w-full",
  ],
  {
    variants: {
      variant: {
        neutral: "bg-gradient-to-tl from-surface/10 via-transparent",
        success: "bg-gradient-to-tl from-green/10 via-transparent",
        error: " bg-gradient-to-tl from-red/10 via-transparent",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type NoticeType = {
  id?: string;
  variant?: "neutral" | "success" | "error";
  title?: string;
  description?: string;
  icon?: JSX.Element;
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
      class={twMerge(
        noticeStyles({ variant: props.notice.variant }),
        isVisible() ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      )}
      data-id={props.notice.id}
      ref={onRef}
    >
      <Button
        variant="outlined"
        size="icon"
        onClick={removeNotice}
        class="absolute right-3 top-3 size-5 p-1 text-subtext opacity-0 group-hover:opacity-100"
      >
        <XIcon size={16} />
      </Button>

      <div class="mr-6 flex items-start">
        {props.notice.icon && <div class="mr-3 mt-0.5 flex-shrink-0">{props.notice.icon}</div>}
        <div>
          {props.notice.title && <h3 class="mb-1 text-base font-semibold">{props.notice.title}</h3>}
          {props.notice.description && <p class="text-sm text-subtext">{props.notice.description}</p>}
        </div>
      </div>

      <div
        class="absolute bottom-0 h-0.5 rounded-full bg-overlay transition-all ease-linear"
        style={{
          animation: `shrinkWidth ${NOTICE_DURATION}ms linear forwards`,
        }}
      ></div>
    </div>
  );
};

export default Notice;
