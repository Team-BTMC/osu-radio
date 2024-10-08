import { Component, createEffect, createSignal, For, Signal } from "solid-js";
import TextField from "../form/TextField";
import TagItem from "./TagItem";
import "../../assets/css/search/tag-select.css";
import Gradient from "../Gradient";

export type Tag = {
  name: string;
  isSpecial?: boolean;
};

type TagSelectProps = {
  /** Must have ```json
   * { equals: false }
   * ``` */
  tags: Signal<Tag[]>;
  disabled?: boolean;
};

const TagSelect: Component<TagSelectProps> = (props) => {
  const [tags, setTags] = props.tags;
  const tagSignal = createSignal("");
  const [tagField, setTagField] = createSignal<HTMLElement | undefined>();
  let dialog;

  const openDialog = () => {
    dialog.showModal();
    window.dispatchEvent(new Event("resize"));
  };

  const closeDialog = () => {
    dialog.close();
    const field = tagField();

    if (field === undefined) {
      return;
    }

    field.textContent = "";
  };

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key !== "Enter") {
      return;
    }

    const input = tagField();

    if (input === undefined) {
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    if (input.textContent === null) {
      return;
    }

    const newTags = input.textContent.trim().split(" ");
    const oldTags = tags();

    for (let i = 0; i < newTags.length; i++) {
      if (newTags[i] === "") {
        continue;
      }

      const index = oldTags.findIndex((t) => t.name === newTags[i]);

      if (index !== -1) {
        continue;
      }

      oldTags.push({ name: newTags[i] });
    }

    setTags(oldTags);

    input.textContent = "";
    input.focus();
  };

  createEffect(() => {
    const input = tagField();

    if (input === undefined) {
      return;
    }

    input.addEventListener("keydown", onKeyDown);
  });

  const onTagRemove = (name: string) => {
    const t = tags();
    const index = t.findIndex((x) => x.name === name);

    if (index === -1) {
      return;
    }

    t.splice(index, 1);
    setTags(t);
  };

  const onTagChange = (name: string) => {
    const t = tags();
    const index = t.findIndex((x) => x.name === name);

    if (index === -1) {
      return;
    }

    t[index] = {
      name,
      isSpecial: !t[index].isSpecial,
    };

    setTags(t);
  };

  return (
    <div class={"tags"}>
      <button
        onClick={openDialog}
        disabled={props.disabled}
        title={"Add/Remove tags for searching"}
      >
        <i class="ri-tag-line" />
      </button>
      <dialog ref={dialog} class={"tag-select"}>
        <Gradient classTop={"tag-select-container"}>
          <TextField value={tagSignal} setInput={setTagField} />

          <span class={"hint"}>
            Type the name of a tag into input above and press enter to add it. After it is added you
            can right-click it and change it to exclude songs with given tag.
          </span>

          <div class={"tags-container"}>
            <For each={tags()}>
              {(tag: Tag) => (
                <TagItem
                  name={tag.name}
                  isSpecial={tag.isSpecial === true}
                  onRemove={onTagRemove}
                  onChange={onTagChange}
                />
              )}
            </For>
          </div>

          <button onClick={closeDialog}>Close</button>
        </Gradient>
      </dialog>
    </div>
  );
};

export default TagSelect;
