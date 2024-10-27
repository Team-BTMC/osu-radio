import { OsuSearchAbleProperties, SongIndex, SongsQueryPayload, Tag } from "@types";
import { assertNever } from "../tungsten/assertNever";

export function filter(indexes: SongIndex[], query: SongsQueryPayload): SongIndex[] {
  if (query.searchQuery === undefined) {
    return indexes;
  }

  // Unnamed may be valid words (DragonForce, Freedom, Dive) or parts of difficulty name ([Endless, [YEP])
  // All words are treated as parts of title
  const [title, diffs] = parseUnnamed(query.searchQuery.unnamed);

  return indexes.filter((s) => {
    if (query.searchQuery === undefined) {
      // Default pass
      return true;
    }

    const c = compare(title, s.t);

    if (!c.satisfies) {
      return false;
    }

    for (let i = 0; i < diffs.length; i++) {
      if (!verifyDiff(s.diffs, diffs[i])) {
        return false;
      }
    }

    if (!tagsFilter(s.tags ?? [], query.tags)) {
      return false;
    }

    for (const prop in query.searchQuery.properties) {
      for (let i = 0; i < query.searchQuery.properties[prop].length; i++) {
        const { symbol, value } = query.searchQuery.properties[prop][i];

        const indexValue = getProp(s, prop as OsuSearchAbleProperties);

        if (indexValue === undefined) {
          continue;
        }

        let shouldContinue: boolean;
        if (typeof indexValue === "string") {
          shouldContinue = verifyString(indexValue, symbol, value);
        } else {
          shouldContinue = verifyValue(indexValue, symbol, value);
        }

        if (!shouldContinue) {
          return false;
        }
      }
    }

    return true;
  });
}

function parseUnnamed(unnamed: string[]): [string, string[]] {
  let titleBuffer = "";
  const diffsBuffer: string[] = [];

  for (let i = 0; i < unnamed.length; i++) {
    const str = unnamed[i];

    if (str[0] === "[" || str[str.length - 1] === "]") {
      if (str.length - Number(str[0] === "[") - Number(str[str.length - 1] === "]") === 0) {
        continue;
      }

      diffsBuffer.push(str);
      continue;
    }

    titleBuffer += str;
  }

  return [titleBuffer, diffsBuffer];
}

/**
 * Pattern may be spelled incorrectly but still satisfy the filtering. The letters must be in correct order to pass
 *
 * Example:
 *
 * `pattern = sin` and `str = string` is valid because `SIN` is in `StrINg`
 *
 * @param pattern
 * @param str
 */
function compare(pattern: string, str: string) {
  pattern = pattern.toLowerCase().replaceAll("_", ""); // underscores are ignored

  if (pattern.length === 0) {
    return {
      distance: 0,
      satisfies: true,
    };
  }

  let patternPtr = 0;
  let lastCharPos = -1;
  let sum = 1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === pattern[patternPtr]) {
      patternPtr++;

      if (lastCharPos !== -1) {
        sum += i - lastCharPos;
      }

      lastCharPos = i;

      if (patternPtr === pattern.length) {
        return {
          distance: sum / pattern.length,
          satisfies: true,
        };
      }
    }
  }

  return {
    satisfies: false,
  };
}

function getProp(song: SongIndex, prop: OsuSearchAbleProperties): string | number | undefined {
  switch (prop) {
    case "artist":
      return song.a;
    case "title":
      return song.t;
    case "length":
      return song.d;
    case "bpm":
      return song.bpm;
    case "creator":
      return song.c;
    case "mode":
      return song.m;
    case "diff":
      return song.diffs.join("");
    default:
      assertNever(prop);
  }

  return undefined;
}

function verifyString(indexValue: string, symbol: string, propValue: string) {
  switch (symbol) {
    case "=":
    case "==":
      return compare(propValue, indexValue).satisfies;
    case "!=":
      return !indexValue.includes(propValue);
    default:
      console.error(`Relation symbol '${symbol}' is not supported.`);
  }

  return false;
}

function verifyValue(indexValue: number, symbol: string, propValue: number) {
  switch (symbol) {
    case "=":
    case "==":
      return indexValue == propValue;
    case "!=":
      return indexValue != propValue;
    case ">":
      return indexValue > propValue;
    case ">=":
      return indexValue >= propValue;
    case "<":
      return indexValue < propValue;
    case "<=":
      return indexValue <= propValue;
    default:
      console.error(`Relation symbol '${symbol}' is not supported.`);
  }

  return false;
}

function verifyDiff(indexDiffs: string[], value: string) {
  const hasOpeningBracket = value[0] === "[";
  const hasClosingBracket = value[value.length - 1] === "]";
  const diff = value.substring(Number(hasOpeningBracket), value.length - Number(hasClosingBracket));

  let isPresent = false;

  for (let j = 0; j < indexDiffs.length; j++) {
    if (hasOpeningBracket && hasClosingBracket) {
      isPresent = isPresent || indexDiffs[j] === diff;
      continue;
    }

    if (hasOpeningBracket) {
      isPresent = isPresent || indexDiffs[j].startsWith(diff);
    }

    if (hasClosingBracket) {
      isPresent = isPresent || indexDiffs[j].endsWith(diff);
    }
  }

  return isPresent;
}

function tagsFilter(indexTags: string[], tags: Tag[]): boolean {
  if (indexTags.length === 0 || tags.length === 0) {
    return true;
  }

  let mustHaveCount = 0;
  let actuallyHasCount = 0;

  for (let i = 0; i < tags.length; i++) {
    const includesTag = indexTags.includes(tags[i].name);

    // isSpecial is wrong name for the variable and should be renamed... It means isExcluded
    if (tags[i].isSpecial === true) {
      if (includesTag) {
        return false;
      }

      continue;
    }

    mustHaveCount++;

    if (includesTag) {
      actuallyHasCount++;
    }
  }

  return mustHaveCount === actuallyHasCount;
}
