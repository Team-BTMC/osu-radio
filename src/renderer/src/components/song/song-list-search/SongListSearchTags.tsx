import FilterOption from "./FilterOption";
import { Component } from "solid-js";

type Props = {
  disabled?: boolean;
};
export const SongListSearchTags: Component<Props> = (props) => {
  return (
    <FilterOption>
      <FilterOption.Label>Tags</FilterOption.Label>
      <FilterOption.List>
        <FilterOption.Trigger disabled={props.disabled}>None</FilterOption.Trigger>
      </FilterOption.List>
      <FilterOption.Content>Tags placeholder</FilterOption.Content>
    </FilterOption>
  );
};
