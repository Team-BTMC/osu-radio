import FilterOption from "./FilterOption";

export const SongListSearchTags = () => {
  return (
    <FilterOption>
      <FilterOption.Label>Tags</FilterOption.Label>
      <FilterOption.List>
        <FilterOption.Trigger>None</FilterOption.Trigger>
      </FilterOption.List>
      <FilterOption.Content>Tags placeholder</FilterOption.Content>
    </FilterOption>
  );
};
