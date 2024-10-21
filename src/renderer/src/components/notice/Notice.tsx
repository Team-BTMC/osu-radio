import Button from "../button/Button";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
import { Component, createEffect, createSignal, JSX, onMount, Show } from "solid-js";
import { twMerge } from "tailwind-merge";

const bgStyle = cva([], {
  variants: {
    variant: {
      success: "bg-green after:bg-green",
      neutral: "bg-overlay after:bg-overlay",
      error: "bg-red after:bg-red",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const textStyle = cva([], {
  variants: {
    variant: {
      success: "text-green",
      neutral: "text-subtext",
      error: "text-red",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export type NoticeType = {
  id?: string;
  variant?: "neutral" | "success" | "error";
  title?: string;
  description?: string;
  icon?: JSX.Element;
};

type NoticeProps = {
  notice: NoticeType;
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
    pausedTime = Date.now() - startTime;
  };

  const resumeRemoveTimeout = () => {
    startTime = Date.now() - pausedTime;
    timeout = setTimeout(removeNotice, NOTICE_DURATION - pausedTime);
  };

  onMount(() => {
    setTimeout(() => setIsVisible(true), 50); // Delay to trigger enter animation
    startRemoveTimeout();
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
        bgStyle({ variant: props.notice.variant }),
        `after:absolute after:inset-0 after:-z-20 after:size-20 after:rounded-full after:blur-2xl after:content-['']`,
        `before:absolute before:inset-0.5 before:-z-10 before:rounded-[10px] before:bg-thick-material before:content-['']`,
        "group relative w-96 transform overflow-hidden rounded-xl bg-thick-material p-4 shadow-2xl ring-2 ring-inset ring-stroke backdrop-blur-md duration-300 ease-in-out",
        isVisible() ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 blur-sm",
        isRemoving()
          ? "my-0 h-0 max-h-0 min-h-0 -rotate-12 scale-75 py-0 opacity-0 blur-sm"
          : "my-2 min-h-20",
      )}
      data-id={props.notice.id}
    >
      <Button
        variant="outlined"
        size="icon"
        onClick={removeNotice}
        class="absolute right-3 top-3 size-5 p-1 text-subtext opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        <XIcon size={16} />
      </Button>

      <div class="mr-6 flex items-start">
        <Show when={props.notice.icon}>
          <div
            class={twMerge(
              "mr-3 mt-0.5 flex-shrink-0",
              textStyle({ variant: props.notice.variant }),
            )}
          >
            {props.notice.icon}
          </div>
        </Show>
        <div class="overflow-hidden">
          <Show when={props.notice.title}>
            <h3 class="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
              {props.notice.title}
            </h3>
          </Show>
          <Show when={props.notice.description}>
            <p class="line-clamp-2 text-ellipsis text-sm text-subtext">
              {props.notice.description}
            </p>
          </Show>
        </div>
        <div
          class={twMerge(
            "absolute bottom-0 left-0 h-0.5 rounded-full",
            bgStyle({ variant: props.notice.variant }),
          )}
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
