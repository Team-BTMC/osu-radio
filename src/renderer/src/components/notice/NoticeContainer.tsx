import { Result } from "../../../../@types";
import { fail, ok } from "../../lib/rust-like-utils-client/Result";
import { TokenNamespace } from "../../lib/tungsten/token";
import Notice, { NoticeType } from "./Notice";
import { NOTICE_DURATION } from "./Notice";
import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

type NoticeExtended = {
  notice: NoticeType;
  visible: boolean;
};

const [notices, setNotices] = createStore<NoticeExtended[]>([]);
const namespace = new TokenNamespace();
const [isPaused, setIsPaused] = createSignal(false);

export function addNotice(notice: NoticeType): void {
  if (notice.id === undefined) {
    notice.id = namespace.create();
  }
  setNotices([
    ...notices,
    {
      notice: {
        ...notice,
        variant: notice.variant || "neutral",
      },
      visible: false,
    },
  ]);
}

export function hideNotice(id: string | undefined): Result<void, string> {
  if (id === undefined) {
    return fail("Passed undefined ID.");
  }

  setNotices((notices) => notices.filter((n) => n.notice.id !== id));

  return ok(undefined);
}

export { notices, isPaused, setIsPaused };

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const el = entry.target;

    if (!(el instanceof HTMLElement)) {
      return;
    }

    const id = el.dataset.id;

    if (id === undefined) {
      return;
    }

    setNotices((ex) => ex.notice.id === id, "visible", entry.isIntersecting);
  }
});

window.api.listen("notify", (n: NoticeType) => {
  addNotice(n);
});

const NoticeContainer = () => {
  const handleRemove = (id: string) => {
    hideNotice(id);
  };

  return (
    <div
      class="fixed right-4 top-16 z-50 flex w-96 flex-col gap-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <For each={notices.filter((n) => n.notice.active !== false)}>
        {(n) => (
          <Notice
            notice={n.notice}
            onMount={(e) => observer.observe(e)}
            onRemove={handleRemove}
            isPaused={isPaused()}
          />
        )}
      </For>
    </div>
  );
};

export default NoticeContainer;
