import Dropdown from "@renderer/components/dropdown/Dropdown";
import useControllableState from "@renderer/lib/controllable-state";
import { cva } from "class-variance-authority";
import {
  Accessor,
  Component,
  createMemo,
  createSignal,
  For,
  JSX,
  Match,
  Show,
  Switch,
} from "solid-js";

export type TagMode = "include" | "discart";
export type TagLabel = ReturnType<typeof tagsToLabel>;
export type Props = {
  value?: Accessor<Map<string, TagMode>>;
  onValueChange?: (newValue: Map<string, TagMode>) => void;
};

const tagsToLabel = (tags: [string, TagMode][]) => {
  const fistTag = tags[0];
  let additionalInclude = 0;
  let additionalDiscart = 0;
  for (let i = 1; i < tags.length; i++) {
    const [, tagMode] = tags[i];
    switch (tagMode) {
      case "include":
        additionalInclude++;
        break;
      case "discart":
        additionalDiscart++;
        break;
      default:
        break;
    }
  }

  return {
    fistTag,
    additionalDiscart,
    additionalInclude,
  };
};

const SongListSearchTags: Component<Props> = (props) => {
  const [hasFetchedTags, setHasFetchedTags] = createSignal(false);
  const [isPopopOpen, setIsPopopOpen] = createSignal(false);
  const [tags, setTags] = createSignal<string[]>([]);
  const [showHint, setShowHint] = createSignal(true);
  const [selectedTags, setSelectedTags] = useControllableState({
    prop: props.value,
    onChange: props.onValueChange,
    defaultProp: new Map<string, TagMode>(),
  });

  const label = createMemo(() => {
    const s = Array.from(selectedTags().entries());
    if (s.length === 0) {
      return "Tags";
    }

    return tagsToLabel(s);
  });

  const fetchTags = async () => {
    setHasFetchedTags(true);
    const remoteTags = await window.api.request("query::tags::search");
    setTags(remoteTags);
  };

  const handlePopoverChange = (newValue: boolean) => {
    setIsPopopOpen(newValue);

    if (!newValue || hasFetchedTags()) {
      return;
    }

    fetchTags();
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((oldSelectedTags) => {
      const newSelectedTags = new Map(oldSelectedTags);
      const tagMode = newSelectedTags.get(tag);

      if (typeof tagMode === "undefined") {
        newSelectedTags.set(tag, "include");
      } else if (tagMode === "include") {
        newSelectedTags.set(tag, "discart");
      } else if (tagMode === "discart") {
        newSelectedTags.delete(tag);
      }

      return newSelectedTags;
    });
  };

  return (
    <Dropdown isOpen={isPopopOpen} onValueChange={handlePopoverChange}>
      <Dropdown.Trigger>
        <Switch>
          <Match when={typeof label() === "string"}>
            <span>{label() as string}</span>
          </Match>
          <Match when={typeof label() !== "string"}>
            <TagSelectedLabel label={label as Accessor<TagLabel>} />
          </Match>
        </Switch>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div class="song-list-search-tags">
          <Show when={showHint()}>
            <div class="song-list-search-tags__hint">
              <span>
                Click on any tag once to include it. Click on it again to exclude it. Click once
                more to clear it
              </span>{" "}
              <button
                class="song-list-search-tags__hint-dismiss"
                onClick={() => setShowHint(false)}
              >
                Dismiss
              </button>
            </div>
          </Show>
          <div class="flex flex-wrap gap-x-1.5 gap-y-2 pt-2">
            <For each={tags()}>
              {(tag) => (
                <Tag tag={tag} onTagClick={handleTagClick} mode={selectedTags().get(tag)}>
                  {tag}
                </Tag>
              )}
            </For>
          </div>
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
};

export type TagProps = {
  mode?: TagMode;
  tag: string;
  children: JSX.Element;
  onTagClick?: (tag: string) => void;
};
const tagStyles = cva(["select-none rounded px-3 py-1"], {
  variants: {
    mode: {
      default: "border-solid border-stroke",
      include: "border-solid border-green bg-green/5",
      discart: "border-dashed border-red bg-red/5",
    },
  },
  defaultVariants: {
    mode: "default",
  },
});
const Tag: Component<TagProps> = (props) => {
  return (
    <button onClick={() => props.onTagClick?.(props.tag)} class={tagStyles({ mode: props.mode })}>
      {props.children}
    </button>
  );
};

export type TagSelectedLabelProps = {
  label: Accessor<TagLabel>;
};
const TagSelectedLabel: Component<TagSelectedLabelProps> = (props) => {
  const firstTag = () => {
    const [name, mode] = props.label().fistTag;
    return { name, mode };
  };

  return (
    <span class="flex gap-2">
      <span
        classList={{
          "text-green": firstTag().mode === "include",
          "text-red": firstTag().mode === "discart",
        }}
      >
        {firstTag().name}
      </span>
      <Show when={props.label().additionalInclude > 0}>
        <span class="text-green">+{props.label().additionalInclude}</span>
      </Show>
      <Show when={props.label().additionalDiscart > 0}>
        <span class="text-red">-{props.label().additionalDiscart}</span>
      </Show>
    </span>
  );
};

export default SongListSearchTags;
