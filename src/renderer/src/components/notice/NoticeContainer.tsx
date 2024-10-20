import { Result } from "../../../../@types";
import { fail, ok } from "../../lib/rust-like-utils-client/Result";
import { TokenNamespace } from "../../lib/tungsten/token";
import Notice, { NoticeType } from "./Notice";
import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

type NoticeExtended = {
  notice: NoticeType;
  visible: boolean;
  hovered: boolean;
  rect: DOMRect | null;
};

const [notices, setNotices] = createStore<NoticeExtended[]>([]);
const namespace = new TokenNamespace();
const [hoveredNotice, setHoveredNotice] = createSignal<string | null>(null);

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
      hovered: false,
      rect: null,
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

export { notices };

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
  if (n.id === undefined) {
    n.id = namespace.create();
  }

  setNotices([
    ...notices,
    {
      notice: n,
      visible: false,
      hovered: false,
      rect: null,
    },
  ]);
});

const NoticeContainer = () => {
  const handleRemove = (id: string) => {
    hideNotice(id);
  };

  const handleHover = (id: string, isHovering: boolean, rect: DOMRect | null) => {
    setNotices((notice) => notice.notice.id === id, "rect", rect);
    setNotices((notice) => notice.notice.id === id, "hovered", isHovering);
    setHoveredNotice(isHovering ? id : null);

    if (!isHovering) {
      // Remove the notice after the shooting off animation completes
      setTimeout(() => {
        hideNotice(id);
      }, 300); // Match this with the animation duration
    }
  };

  return (
    <div class="fixed right-4 top-16 z-50 flex w-96 flex-col gap-0">
      <style>{`
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
      <For each={notices.filter((n) => n.notice.active !== false)}>
        {(n) => (
          <div
            class={`transition-all duration-300 ease-in-out ${
              n.hovered ? "z-50" : hoveredNotice() ? "blur-sm" : ""
            }`}
          >
            <Notice
              rect={n.rect}
              notice={n.notice}
              onMount={(e) => observer.observe(e)}
              onRemove={handleRemove}
              onHover={handleHover}
            />
          </div>
        )}
      </For>
    </div>
  );
};

export default NoticeContainer;
