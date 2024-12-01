import FilterOption from "./FilterOption";
import { Input } from "@renderer/components/input/Input";
import useControllableState from "@renderer/lib/controllable-state";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-solid";
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

/** Groups selected tags by mode, returns a map with include and discart tags, having the include tags first */
function groupSelectedTagsByMode(selectedTags: Map<string, TagMode>): Map<string, TagMode> {
  const include = new Map<string, TagMode>();
  const discart = new Map<string, TagMode>();

  selectedTags.forEach((mode, tag) => {
    if (mode === "include") {
      include.set(tag, mode);
    } else if (mode === "discart") {
      discart.set(tag, mode);
    }
  });

  return new Map([...include, ...discart]);
}

export const SongListSearchTags: Component<Props> = (props) => {
  const [hasFetchedTags, setHasFetchedTags] = createSignal(false);
  const [isPopopOpen, setIsPopopOpen] = createSignal(false);
  const [tags, setTags] = createSignal<string[]>([]);
  const [showHint, setShowHint] = createSignal(true);
  const [selectedTags, setSelectedTags] = useControllableState({
    prop: props.value,
    onChange: props.onValueChange,
    defaultProp: new Map<string, TagMode>(),
  });
  const [search, setSearch] = createSignal("");
  const [isScrolled, setIsScrolled] = createSignal(false);

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

      return groupSelectedTagsByMode(newSelectedTags);
    });
  };

  const removeTag = (tag: string) => {
    setSelectedTags((oldSelectedTags) => {
      const newSelectedTags = new Map(oldSelectedTags);
      newSelectedTags.delete(tag);
      return groupSelectedTagsByMode(newSelectedTags);
    });
  };

  const clearAllTags = () => {
    setSelectedTags(new Map<string, TagMode>());
  };

  const filteredTags = createMemo(() => {
    return tags().filter((tag) => tag.includes(search()));
  });
  const selectedTagsEntries = createMemo(() => Array.from(selectedTags().entries()));
  const selectedTagsCount = createMemo(() => selectedTagsEntries().length);

  return (
    <FilterOption popoverProps={{ isOpen: isPopopOpen, onValueChange: handlePopoverChange }}>
      <FilterOption.Label>Tags</FilterOption.Label>
      <FilterOption.List>
        <FilterOption.Trigger>
          <Switch>
            <Match when={typeof label() === "string"}>
              <span>{label() as string}</span>
            </Match>
            <Match when={typeof label() !== "string"}>
              <TagSelectedLabel label={label as Accessor<TagLabel>} />
            </Match>
          </Switch>
        </FilterOption.Trigger>
      </FilterOption.List>
      <FilterOption.Content
        class="max-h-[500px] max-w-sm overflow-y-auto"
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
      >
        <div>
          <div
            class="sticky -top-2 flex flex-wrap gap-x-1.5 gap-y-2 border-b border-b-transparent bg-thick-material p-1"
            classList={{
              "border-b-stroke": isScrolled(),
            }}
          >
            <Input
              size="sm"
              placeholder="Search tags"
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />
            <Show when={selectedTagsCount() > 0}>
              <For each={selectedTagsEntries()}>
                {([tag, mode]) => (
                  <div
                    class={tagStyles({
                      mode,
                      className: "flex items-center gap-1 px-1.5 py-0.5 text-sm",
                    })}
                  >
                    <span>{tag}</span>
                    <button class="text-gray-500" onClick={() => removeTag(tag)}>
                      <XIcon size={16} />
                    </button>
                  </div>
                )}
              </For>
              <button onClick={clearAllTags}>Clear all</button>
            </Show>
          </div>
          <Show when={showHint()}>
            <div class="px-1 text-sm">
              <span class="text-subtext">
                Click on any tag once to include it. Click on it again to exclude it. Click once
                more to clear it
              </span>{" "}
              <button class="underline" onClick={() => setShowHint(false)}>
                Dismiss
              </button>
            </div>
          </Show>
          <div class="flex flex-wrap gap-2 px-1 pt-2">
            <For each={filteredTags()}>
              {(tag) => (
                <Tag tag={tag} onTagClick={handleTagClick} mode={selectedTags().get(tag)}>
                  {tag}
                </Tag>
              )}
            </For>
          </div>
        </div>
      </FilterOption.Content>
    </FilterOption>
  );
};

export type TagProps = {
  mode?: TagMode;
  tag: string;
  children: JSX.Element;
  onTagClick?: (tag: string) => void;
};
const tagStyles = cva(["select-none rounded-md px-3 py-1 border"], {
  variants: {
    mode: {
      default: "border-solid border-transparent bg-surface",
      include: "border-solid border-green bg-green/5",
      discart: "border-dashed border-red-500 bg-red-500/5",
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
          "text-red-500": firstTag().mode === "discart",
        }}
      >
        {firstTag().name}
      </span>
      <Show when={props.label().additionalInclude > 0}>
        <span class="text-green">+{props.label().additionalInclude}</span>
      </Show>
      <Show when={props.label().additionalDiscart > 0}>
        <span class="text-red-500">-{props.label().additionalDiscart}</span>
      </Show>
    </span>
  );
};
