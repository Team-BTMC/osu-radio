import Dropdown from "@renderer/components/dropdown/Dropdown";
import { createSignal, For, Show } from "solid-js";

type TagMode = "include" | "discart";

const SongListSearchTags = () => {
  const [hasFetchedTags, setHasFetchedTags] = createSignal(false);
  const [isPopopOpen, setIsPopopOpen] = createSignal(false);
  const [tags, setTags] = createSignal<string[]>([]);
  const [showHint, setShowHint] = createSignal(true);
  const [selectedTags, setSelectedTags] = createSignal(new Map<string, TagMode>());

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
      <Dropdown.Trigger>Tags</Dropdown.Trigger>
      <Dropdown.Content>
        <div class="song-list-search-tags">
          <Show when={showHint()}>
            <div class="song-list-search-tags__hint">
              <span>
                ⓘ Click on any tag once to include it. Click on it again to exclude it. Click once
                more to clear it
              </span>{" "}
              <button onClick={() => setShowHint(false)}>Dismiss</button>
            </div>
          </Show>
          <div class="song-list-search-tags__content">
            <For each={tags()}>
              {(tag) => (
                <button
                  data-mode={selectedTags().get(tag)}
                  onClick={() => handleTagClick(tag)}
                  class="song-list-search-tags__tag"
                >
                  {tag}
                </button>
              )}
            </For>
          </div>
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default SongListSearchTags;
