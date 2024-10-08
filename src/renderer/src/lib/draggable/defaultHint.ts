export default function defaultHint(): HTMLElement {
  const hint = document.createElement("div");

  hint.classList.add("drag-hint");
  hint.textContent = "​";
  hint.dataset.dragHint = "YEP";

  return hint;
}
