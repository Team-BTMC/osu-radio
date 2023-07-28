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
  return searchParser.parse(query);
});



const templateParser = new TemplateParser(templateIdentifiers);

Router.respond("parse::template", (_evt, template) => {
  return templateParser.parse(template);
});