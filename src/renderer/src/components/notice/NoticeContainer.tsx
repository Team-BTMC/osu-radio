import { NoticeType, Result } from "../../../../@types";
import "../../assets/css/notice/notice-container.css";
import Impulse from "../../lib/Impulse";
import { fail, ok } from "../../lib/rust-like-utils-client/Result";
import { TokenNamespace } from "../../lib/tungsten/token";
import Notice from "./Notice";
import { For, onMount } from "solid-js";
import { createStore } from "solid-js/store";

type NoticeExtended = {
  notice: NoticeType;
  updateGradient: Impulse;
  visible: boolean;
};

const [notices, setNotices] = createStore<NoticeExtended[]>([]);
const namespace = new TokenNamespace();

export function addNotice(notice: NoticeType): void {
  if (notice.id === undefined) {
    notice.id = namespace.create();
  }

  setNotices([
    ...notices,
    {
      notice,
      updateGradient: new Impulse<void>(),
      visible: false,
    },
  ]);
}

export function hideNotice(id: string | undefined): Result<void, string> {
  if (id === undefined) {
    return fail("Passed undefined ID.");
  }

  setNotices(
    (ex) => ex.notice.id === id,
    "notice",
    "active",
    () => false,
  );

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

window.api.listen("notify", (n) => {
  if (n.id === undefined) {
    n.id = namespace.create();
  }

  setNotices([
    ...notices,
    {
      notice: n,
      updateGradient: new Impulse<void>(),
      visible: false,
    },
  ]);
});

const NoticeContainer = () => {
  let wrapper;

  onMount(() => {
    wrapper.addEventListener("scroll", () => {
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].visible) {
          notices[i].updateGradient.pulse();
        }
      }
    });
  });

  return (
    <div class={"notice-container-wrapper"} ref={wrapper}>
      <div class={"notice-container"}>
        <For each={notices.filter((n) => n.notice.active !== false)}>
          {(n) => (
            <Notice
              notice={n.notice}
              updateGradient={n.updateGradient}
              onMount={(e) => observer.observe(e)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default NoticeContainer;
