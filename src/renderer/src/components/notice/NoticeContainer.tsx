import { Result } from "@shared/types/common.types";
import { fail, ok } from "@shared/lib/rust-types/Result";
import { TokenNamespace } from "@shared/lib/tungsten/token";
import Notice, { IconNoticeType } from "./Notice";
import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { NoticeTypeIconMap } from "@shared/types/common.types";
const [notices, setNotices] = createStore<IconNoticeType[]>([]);
const namespace = new TokenNamespace();
const [isPaused, setIsPaused] = createSignal(false);

// NOTE: If you're looking to send a notice from the backend, do something like this:
// Router.dispatch(window, "notify", {
//   variant: "neutral",
//   title: "",
//   description: "",
//   icon: "a-arrow-up"
// });
// Remember to add "a-arrow-up", etc into the NoticeTypeIconMap.

export function addNotice(notice: IconNoticeType): void {
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

window.api.listen("notify", (n: NoticeTypeIconMap) => {
  const noticeParams: IconNoticeType = {
    id: n.id,
    variant: n.variant,
    title: n.title,
    description: n.description,
  };

  // NOTE: *No icons mapped yet. To add the mapping, do something like this:
  // switch (n.icon) {
  //   case "a-arrow-up":
  //     noticeParams.icon = <...Icon />;
  //     break;
  // }

  addNotice(noticeParams);
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
