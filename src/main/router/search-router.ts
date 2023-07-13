import { Router } from '../lib/route-pass/Router';
import { SearchParser } from '../lib/search-parser/SearchParser';
import {
  defaultRelationSymbols,
  num,
  set,
  text,
  time
} from '../lib/search-parser/validators';



const parser = new SearchParser({
  tokenDelimiter: " ",
  relationSymbols: defaultRelationSymbols,
  propertyMap: {
    bpm: num(false),
    artist: text(),
    creator: text(),
    length: time(),
    mode: set(["osu", "taiko", "catch", "mania", "o", "t", "c", "m"]),
    title: text(),
  }
});

Router.respond("parseSearch", (_evt, query) => {
  return parser.parse(query);
});