import { Token, TemplateTokenizer, Tokens } from "../tokenizer/TemplateTokenizer";
import { closest } from "fastest-levenshtein";

type IdentToken = {
    type: "IDENT",
    literal: string,
    position: number,
}

export type ConfigItem = {
    type: "TEXT" | "IDENT",
    literal: string
}

export type ConfigError = {
    type: "error",
    error: {
        message: string,
        suggestion?: {
            start: number,
            end: number,
            replacement: string,
            description: string
        }
    }
}

export type ConfigSuccess = {
    type: "success",
    config: ConfigItem[]
}



export class TemplateParser {
    private readonly tokenizer: TemplateTokenizer;
    private readonly identifiers: string[];

    constructor(input: string, identifiers: string[]) {
        this.tokenizer = new TemplateTokenizer(input);
        this.identifiers = identifiers;
    }

    getTemplateConfig(): ConfigError | ConfigSuccess {
        const tokens = this.tokenizer.getTokens();
        const config: ConfigItem[] = [];

        for (let i = 0; i < tokens.length; i++) {
            switch (tokens[i].type) {
                case "{": {
                    const isIdentifier = tokens[i + 1]?.type === Tokens.Text && tokens[i + 2]?.type === Tokens.RightSquirly;

                    if (!isIdentifier) {
                        return {
                            type: "error",
                            error: {
                                message: "Invalid identifier expression",
                                suggestion: {
                                    start: tokens[i].position,
                                    end: tokens[i].position + tokens[i].literal.length,
                                    description: "Remove '{'.",
                                    replacement: ""
                                }
                            }
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
                                    replacement: closestIdent
                                }
                            }
                        };
                    }

                    config.push({
                        type: "IDENT",
                        literal: tokens[i + 1].literal
                    });

                    i += 2;

                    break;
                }
                case "TEXT":
                    config.push({
                        type: "TEXT",
                        literal: tokens[i].literal
                    });
                    break;
                case "ILLEGAL":
                    return {
                        type: "error",
                        error: {
                            message: `Illegal token '${tokens[i].literal}'`,
                        }
                    };
            }
        }

        return {
            type: "success",
            config
        };
    }
}