import Button from "@renderer/components/button/Button";
import { NoticeType } from "@shared/types/common.types";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
import { Component, createEffect, createMemo, createSignal, JSX, onMount, Show } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge";

const bgStyle = cva([], {
  variants: {
    variant: {
      success: "bg-green after:bg-green",
      neutral: "bg-overlay after:bg-overlay",
      error: "bg-danger after:bg-danger",
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
      error: "text-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export type IconNoticeType = NoticeType & {
  icon?: JSX.Element;
};

type NoticeProps = {
  notice: IconNoticeType;
  onRemove: (id: string) => void;
  isPaused: boolean;
};

const NOTICE_DURATION = 3_000; // 3 seconds

const Notice: Component<NoticeProps> = (props) => {
  const [isRemoving, setIsRemoving] = createSignal(false);
  let noticeRef: HTMLDivElement | undefined;
  let timeout: NodeJS.Timeout;
  let startTime: number;
  let pausedTime: number = 0;

  const removeNotice = () => {
    setIsRemoving(true);
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

  const handleAnimationEnd = (
    event: AnimationEvent & {
      currentTarget: HTMLDivElement;
      target: DOMElement;
    },
  ) => {
    // Validates if the animation finidhed on the current element
    if (event.target !== event.currentTarget) {
      return;
    }

    if (!isRemoving()) {
      return;
    }

    props.onRemove(props.notice.id!);
  };

  const removingClasses = createMemo(() => {
    if (isRemoving()) {
      return "animate-notice-slide-out";
    }
    return "my-2 min-h-20";
  });

  return (
    <div
      ref={noticeRef}
      onAnimationEnd={handleAnimationEnd}
      class={twMerge(
        // Background
        bgStyle({ variant: props.notice.variant }),
        // General
        "group relative w-96 transform overflow-hidden rounded-xl bg-thick-material p-4 shadow-2xl ring-2 ring-inset ring-stroke backdrop-blur-md duration-300 ease-in-out",
        // After
        `after:absolute after:inset-0 after:-z-20 after:size-20 after:rounded-full after:blur-2xl after:content-['']`,
        // Before
        `before:absolute before:inset-0.5 before:-z-10 before:rounded-[10px] before:bg-thick-material before:content-['']`,
        // Enter animation
        "animate-notice-slide-in",
        // Removing
        removingClasses(),
      )}
      data-id={props.notice.id}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={removeNotice}
        class="absolute right-4 top-4 size-5 p-1 text-subtext opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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
      </div>

      <div
        class="pointer-events-none absolute inset-0 m-px overflow-hidden"
        style={{
          "border-radius": "13px",
        }}
      >
        <div
          class={twMerge(
            "absolute bottom-px left-0 h-1 rounded-full",
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
