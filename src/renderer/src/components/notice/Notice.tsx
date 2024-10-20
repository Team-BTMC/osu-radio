import Button from "../button/Button";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
import { Component, createSignal, JSX, onMount, Show } from "solid-js";
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
  onHover: (id: string, isHovering: boolean, rect: DOMRect | null) => void;
};

const NOTICE_DURATION = 3000; // 3 seconds
const ANIMATION_DURATION = 300; // 300ms for enter/exit animations

const Notice: Component<NoticeProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [isRemoving, setIsRemoving] = createSignal(false);
  const [isPaused, setIsPaused] = createSignal(false);
  const [remainingTime, setRemainingTime] = createSignal(NOTICE_DURATION);

  let noticeRef: HTMLDivElement | undefined;
  let progressBarRef: HTMLDivElement | undefined;
  let timeoutId: number | NodeJS.Timeout | undefined;
  let startTime: number;

  const removeNotice = () => {
    setIsRemoving(true);
    setTimeout(() => {
      props.onRemove(props.notice.id!);
    }, ANIMATION_DURATION);
  };

  const updateTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (remainingTime() > 0) {
      timeoutId = setTimeout(() => {
        if (!isPaused()) {
          removeNotice();
        }
      }, remainingTime());
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (noticeRef) {
      const rect = noticeRef.getBoundingClientRect();
      props.onHover(props.notice.id!, true, rect);
    }
    if (progressBarRef) {
      progressBarRef.style.animationPlayState = "paused";
    }
    setRemainingTime((prev) => prev - (Date.now() - startTime));
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    props.onHover(props.notice.id!, false, null);
    if (progressBarRef) {
      progressBarRef.style.animationPlayState = "running";
    }
    startTime = Date.now();
    updateTimeout();
  };

  onMount(() => {
    setTimeout(() => setIsVisible(true), 50); // Delay to trigger enter animation
    startTime = Date.now();
    updateTimeout();
  });

  return (
    <div
      ref={noticeRef}
      class={twMerge(
        noticeStyles({ variant: props.notice.variant }),
        "transition-all duration-300 ease-in-out",
        isVisible() ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 blur-sm",
        isRemoving() ? "my-0 max-h-0 py-0 opacity-0 blur-sm" : "my-2 max-h-32",
        isPaused() ? "z-50" : "z-auto",
      )}
      data-id={props.notice.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      </div>
      <div
        ref={progressBarRef}
        class="absolute bottom-0 left-0 h-0.5 rounded-full bg-overlay transition-all ease-linear"
        style={{
          animation: `shrinkWidth ${NOTICE_DURATION}ms linear forwards`,
        }}
      ></div>
    </div>
  );
};

export default Notice;
