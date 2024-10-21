import Button from "../button/Button";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
import { Component, createEffect, createSignal, JSX, onMount, Show } from "solid-js";
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
  onRemove: (id: string) => void;
  isPaused: boolean;
};

const NOTICE_DURATION = 3_000; // 3 seconds
const ANIMATION_DURATION = 300; // 300ms for enter/exit animations

const Notice: Component<NoticeProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [isRemoving, setIsRemoving] = createSignal(false);
  let noticeRef: HTMLDivElement | undefined;
  let timeout: NodeJS.Timeout;
  let startTime: number;
  let pausedTime: number = 0;

  const removeNotice = () => {
    setIsRemoving(true);
    setTimeout(() => {
      props.onRemove(props.notice.id!);
    }, ANIMATION_DURATION);
  };

  const startRemoveTimeout = () => {
    startTime = Date.now();
    timeout = setTimeout(removeNotice, NOTICE_DURATION);
  };

  const pauseRemoveTimeout = () => {
    clearTimeout(timeout);
    pausedTime = Date.now() - startTime;
  };

  const resumeRemoveTimeout = () => {
    startTime = Date.now() - pausedTime;
    timeout = setTimeout(removeNotice, NOTICE_DURATION - pausedTime);
  };

  onMount(() => {
    setTimeout(() => setIsVisible(true), 50); // Delay to trigger enter animation
    startRemoveTimeout();
    props.onMount(noticeRef!);
  });

  createEffect(() => {
    clearTimeout(timeout);
    if (props.isPaused) {
      pauseRemoveTimeout();
    } else {
      resumeRemoveTimeout();
    }
  });

  return (
    <div
      ref={noticeRef}
      class={twMerge(
        noticeStyles({ variant: props.notice.variant }),
        "w-96 transition-all duration-300 ease-in-out",
        isVisible() ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 blur-sm",
        isRemoving() ? "my-0 max-h-0 -rotate-12 scale-75 py-0 opacity-0 blur-sm" : "my-2 max-h-32",
      )}
      data-id={props.notice.id}
    >
      <Button
        variant="outlined"
        size="icon"
        onClick={removeNotice}
        class="absolute right-3 top-3 size-5 p-1 text-subtext opacity-0 transition-all group-hover:opacity-100"
      >
        <XIcon size={16} />
      </Button>

      <div class="mr-6 flex items-start">
        <Show when={props.notice.icon}>
          <div class="mr-3 mt-0.5 flex-shrink-0">{props.notice.icon}</div>
        </Show>
        <div class="overflow-hidden">
          <Show when={props.notice.title}>
            <h3 class="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
              {props.notice.title}
            </h3>
          </Show>
          <Show when={props.notice.description}>
            <p class="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-subtext">
              {props.notice.description}
            </p>
          </Show>
        </div>
        <div
          class="absolute bottom-0 left-0 h-0.5 rounded-full bg-overlay"
          style={{
            animation: `progress ${NOTICE_DURATION}ms linear`,
            "animation-play-state": props.isPaused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
};

export default Notice;
