import { Router } from "../lib/route-pass/Router";
import { Storage } from "../lib/storage/Storage";

Router.respond("query::tags::search", () => {
  const allTags = Storage.getTable("system").get("allTags");
  if (allTags.isNone) {
    return [];
  }

  const tagsByUse: string[][] = [];
  Object.entries(allTags.value).forEach(([tagName, songs]) => {
    if (!tagName) {
      return;
    }

    const size = songs.length;
    tagsByUse[size] = (tagsByUse[size] ?? []).concat(tagName);
  });

  let result: string[] = [];
  for (let i = tagsByUse.length - 1; i > 0; i--) {
    const tagGroup = tagsByUse[i];
    if (!tagGroup) {
      continue;
    }

    result = result.concat(tagGroup);
  }

  return result;
});
