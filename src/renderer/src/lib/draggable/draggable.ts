//TODO: redo from parent perspective... how did i not think of this... I'm quite stupid
import defaultHint from "./defaultHint";
import scrollAnimation from "./scrollAnimation";
import { Vec2, vec2Length } from "@shared/lib/tungsten/math";

export type DraggableOptions = {
  onClick: (event: MouseEvent) => any;
  onDrop: (beforeElement: Element | null) => any;
  createHint?: () => HTMLElement;
  useOnlyAsOnClickBinder?: boolean;
};

const X = 0 as const;
const Y = 1;

const MAX_VELOCITY_SIZE = 20;

let isDragging = false;
const velocity: number[] = [];

let clickEvent: MouseEvent | undefined = undefined;
let onClick: ((event: MouseEvent) => any) | undefined = undefined;
let onDrag: ((beforeElement: Element | null) => any) | undefined = undefined;

let element: HTMLElement | undefined = undefined;
let hint: HTMLElement | undefined = undefined;

let movementY: number | undefined = undefined;
let timeout: number | undefined = undefined;
let offset: Vec2 | undefined = undefined;
let start: Vec2 | undefined = undefined;

let cancelScrollAnimation: (() => void) | undefined = undefined;

export function getIsDragging(): boolean {
  return isDragging;
}

export default function draggable(el: HTMLElement, options: DraggableOptions) {
  if (options?.useOnlyAsOnClickBinder === true) {
    const onClick = options.onClick;

    if (onClick === undefined) {
      return;
    }

    el.addEventListener("click", onClick);
    return;
  }

  el.addEventListener("mousedown", (evt) => {
    if (evt.button !== 0) {
      return;
    }

    onClick = options.onClick;
    clickEvent = evt;
    start = [evt.clientX, evt.clientY];

    const rect = el.getBoundingClientRect();
    element = el;

    hint = (options.createHint ?? defaultHint)();
    hint.dataset.dragHint = "YEP";

    offset = [evt.clientX - rect.left, evt.clientY - rect.top];

    timeout = window.setTimeout(() => {
      onClick = undefined;
      onDrag = options.onDrop;
      isDragging = true;
    }, 300);
  });

  const parent = el.parentElement;

  if (parent === null) {
    return;
  }

  el.addEventListener("mousemove", (evt) => {
    if (!isDragging || hint === undefined) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const half = rect.top + rect.height / 2;

    if (evt.clientY <= half) {
      if (
        el.previousElementSibling !== null &&
        (el.previousElementSibling as HTMLElement).dataset.dragHint === "YEP"
      ) {
        return;
      }

      parent.insertBefore(hint, el);
      return;
    }

    if (el.nextElementSibling === null) {
      parent.appendChild(hint);
      return;
    }

    if ((el.nextElementSibling as HTMLElement).dataset.dragHint === "YEP") {
      return;
    }

    parent.insertBefore(hint, el.nextElementSibling);
  });

  if (parent.dataset.onLeave === undefined) {
    parent.dataset.onLeave = "is-set";

    parent.addEventListener("pointerleave", () => {
      if (!isDragging) {
        return;
      }

      if (cancelScrollAnimation !== undefined) {
        cancelScrollAnimation();
      }

      if (movementY === undefined) {
        return;
      }

      const sign = Math.sign(movementY);
      let max = Infinity * sign * -1;
      for (let i = 0; i < velocity.length; i++) {
        if (sign !== Math.sign(velocity[i])) {
          continue;
        }

        if (velocity[i] * sign > max * sign) {
          max = velocity[i];
        }
      }

      cancelScrollAnimation = scrollAnimation(parent, max);
    });

    parent.addEventListener("mouseenter", () => {
      if (cancelScrollAnimation !== undefined) {
        cancelScrollAnimation();
        cancelScrollAnimation = undefined;
      }
    });
  }
}

window.addEventListener("pointermove", (evt) => {
  if (!isDragging) {
    return;
  }

  velocity.push(evt.movementY);

  if (velocity.length > MAX_VELOCITY_SIZE) {
    velocity.shift();
  }

  if (element === undefined || start === undefined) {
    return;
  }

  const end: Vec2 = [evt.clientX, evt.clientY];
  const rect = element.getBoundingClientRect();
  const threshold = Math.min(rect.height, rect.width) / 2;

  if (!isDragging && vec2Length(start, end) >= threshold) {
    onClick = undefined;
    isDragging = true;
  }

  if (!isDragging) {
    return;
  }

  if (element.dataset.dragged !== "YEP") {
    element.dataset.dragged = "YEP";
    const computed = getComputedStyle(element);

    element.dataset.width = computed.width;
    element.style.width = `${element.scrollWidth}px`;

    element.dataset.position = computed.position;
    element.style.position = "fixed";

    element.style.zIndex = "var(--top-layer)";
    element.style.pointerEvents = "none";

    element.parentElement?.classList.add("drag-inside");

    if (hint !== undefined) {
      element.parentElement?.insertBefore(hint, element);
    }
  }

  if (offset === undefined) {
    return;
  }

  element.style.left = `${Math.round(evt.clientX - offset[X])}px`;
  element.style.top = `${Math.round(evt.clientY - offset[Y])}px`;

  movementY = evt.movementY;
});

window.addEventListener("pointerup", () => {
  clearTimeout(timeout);

  if (!isDragging) {
    if (onClick !== undefined && clickEvent !== undefined) {
      onClick(clickEvent);
    }

    cleanUp();
    return;
  }

  if (cancelScrollAnimation !== undefined) {
    cancelScrollAnimation();
  }

  if (element !== undefined) {
    delete element.dataset.dragged;

    element.style.position = element.dataset.position ?? "static";
    delete element.dataset.position;

    element.style.width = element.dataset.width ?? "unset";
    delete element.dataset.width;

    element.style.zIndex = "var(--normal-layer)";
    element.style.removeProperty("pointer-events");
    element.style.removeProperty("top");
    element.style.removeProperty("left");

    element.parentElement?.classList.remove("drag-inside");

    dispatchDrag();

    if (hint !== undefined) {
      hint.parentElement?.insertBefore(element, hint);
    }
  }

  hint?.remove();

  cleanUp();
});

function cleanUp() {
  isDragging = false;

  onClick = undefined;
  onDrag = undefined;

  element = undefined;
  hint = undefined;

  start = undefined;
  offset = undefined;
  movementY = undefined;
  timeout = undefined;

  cancelScrollAnimation = undefined;
}

function dispatchDrag() {
  if (onDrag === undefined || hint === undefined || hint.parentElement === null) {
    return;
  }

  onDrag(hint.previousElementSibling);
}
