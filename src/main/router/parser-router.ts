import { Router } from '../lib/route-pass/Router';
import { SearchParser } from '../lib/search-parser/SearchParser';
import {
  defaultRelationSymbols,
  num,
  set,
  text,
  time
} from '../lib/search-parser/validators';
import { TemplateParser } from '../lib/template-parser/parser/TemplateParser';
import templateIdentifiers from '../lib/template-parser/template-identifiers';



/**
 * Examples of valid search queries:
 * - `freedom dive`
 * - `bpm>220 mode=o length<300 artist=xi`
 * - `[endless dimensions]`
 */
const searchParser = new SearchParser({
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

Router.respond("parse::search", (_evt, query) => {
  // Validates query and creates request for filtering. If the search query is incorrect suggestion to make it correct
  // is returned
  return searchParser.parse(query);
});



/**
 * Valid templates:
 * - `Static template` -> Static template
 * - `{ARTIST} - {TITLE}` -> xi - Freedom Dive
 * - `[{BPM} BPM] {ARTIST} - {TITLE}` -> [222 BPM] xi - Freedom Dive
 */
const templateParser = new TemplateParser(templateIdentifiers);

Router.respond("parse::template", (_evt, template) => {
  // Validates template. If the template is incorrect suggestion to make it correct is incorrect suggestion to make it
  // correct is returned
  return templateParser.parse(template);
});