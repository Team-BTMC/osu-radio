// Template follows tokenizer-parser architecture
// String is converted to tokens and parser validates grammar of token sequence. From this sequence a
// "list of instructions" is created. Using the "list of instructions" together with data source will produce a dynamic
// string templating. Similar architecture is used to interpret search queries
import { TemplateTokenizer, Tokens } from "../tokenizer/TemplateTokenizer";
import { closest } from "fastest-levenshtein";

export type ConfigItem = {
  type: "TEXT" | "IDENT";
  literal: string;
};

export type ConfigError = {
  type: "error";
  error: {
    message: string;
    suggestion?: {
      start: number;
      end: number;
      replacement: string;
      description: string;
    };
  };
};

export type ConfigSuccess = {
  type: "success";
  config: ConfigItem[];
};

export class TemplateParser {
  private readonly identifiers: string[];
  private readonly tokenizer = new TemplateTokenizer();

  constructor(identifiers: string[]) {
    this.identifiers = identifiers;
  }

  parse(input: string): ConfigError | ConfigSuccess {
    const tokens = this.tokenizer.tokenize(input);
    const config: ConfigItem[] = [];

    for (let i = 0; i < tokens.length; i++) {
      switch (tokens[i].type) {
        case "{": {
          // Must follow pattern: {TEXT}
          const isIdentifier =
            tokens[i + 1]?.type === Tokens.Text && tokens[i + 2]?.type === Tokens.RightSquirly;

          if (!isIdentifier) {
            return {
              type: "error",
              error: {
                message: "Invalid identifier expression",
                suggestion: {
                  start: tokens[i].position,
                  end: tokens[i].position + tokens[i].literal.length,
                  description: "Remove '{'.",
                  replacement: "",
                },
              },
            };
          }

          if (!this.identifiers.includes(tokens[i + 1].literal)) {
            const closestIdent = closest(tokens[i].literal, this.identifiers);
            return {
              type: "error",
              error: {
                message: "Unknown identifier",
                suggestion: {
                  start: tokens[i + 1].position,
                  end: tokens[i + 1].position + tokens[i + 1].literal.length,
                  description: `Use '${closestIdent}' identifier.`,
                  replacement: closestIdent,
                },
              },
            };
          }

          config.push({
            type: "IDENT",
            literal: tokens[i + 1].literal,
          });

          i += 2;

          break;
        }
        case "TEXT":
          config.push({
            type: "TEXT",
            literal: tokens[i].literal,
          });
          break;
        case "ILLEGAL":
          return {
            type: "error",
            error: {
              message: `Illegal token '${tokens[i].literal}'`,
            },
          };
      }
    }

    return {
      type: "success",
      config,
    };
  }
}
