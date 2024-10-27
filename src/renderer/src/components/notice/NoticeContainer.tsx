import { Result } from "@types";
import { fail, ok } from "@shared/lib/rust-types/Result";
import { TokenNamespace } from "@shared/lib/tungsten/token";
import Notice, { NoticeType } from "./Notice";
import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const [notices, setNotices] = createStore<NoticeType[]>([]);
const namespace = new TokenNamespace();
const [isPaused, setIsPaused] = createSignal(false);

export function addNotice(notice: NoticeType): void {
  if (notice.id === undefined) {
    notice.id = namespace.create();
  }
  setNotices([
    ...notices,
    {
      ...notice,
      variant: notice.variant || "neutral",
    },
  ]);
}

function hideNotice(id: string | undefined): Result<void, string> {
  if (id === undefined) {
    return fail("Passed undefined ID.");
  }
  setNotices((notices) => notices.filter((n) => n.id !== id));
  return ok(undefined);
}

export { notices, isPaused, setIsPaused };

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
      <For each={notices}>
        {(n) => <Notice notice={n} onRemove={handleRemove} isPaused={isPaused()} />}
      </For>
    </div>
  );
};

export default NoticeContainer;
