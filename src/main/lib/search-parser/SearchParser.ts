import {
    SearchPropertyValidation,
    SearchConfig,
    SearchProperty,
    SearchQuery,
    ValidationSuggestion,
    SearchQuerySuggestion
} from "./@search-types";
import { closestLevenDist } from "./levenshteinDistance";



type ComparisonExtractionTrue = {
    isPresent: true,
    start: number,
    symbol: string
};

type ComparisonExtractionFalse = {
    isPresent: false,
};

type ComparisonExtraction = ComparisonExtractionFalse | ComparisonExtractionTrue



export class SearchParser {
    private config: SearchConfig;

    constructor(config: SearchConfig) {
        this.config = config;
        this.config.relationSymbols = [...this.config.relationSymbols];
        this.config.relationSymbols.sort((a, b) => b.length - a.length);
    }

    parse(query: string): SearchQuery {
        const tokens = query.trim().split(this.config.tokenDelimiter);
        const unnamed: string[] = [];
        const properties: Record<string, SearchProperty[]> = {};

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i].trim();

            if (token === "") {
                continue;
            }

            const extracted = this.extractComparison(token);

            if (!extracted.isPresent) {
                unnamed.push(token);
                continue;
            }

            const [prop, value] = this.split(token, extracted);
            const validation = this.validateProperty(prop, value, extracted.symbol);

            if (!validation.isValid) {
                const slice = tokens.slice(0, i);
                const index = slice.join(this.config.tokenDelimiter);
                const start = slice.length !== 0
                    ? index.length + this.config.tokenDelimiter.length
                    : index.length

                return {
                    query,
                    type: "error",
                    error: {
                        message: validation.error.message,
                        start,
                        end: start + token.length,
                        suggestion: this.createSuggestion(validation.error.suggestion, prop, extracted.symbol, value),
                    }
                }
            }

            if (properties[prop] === undefined) {
                properties[prop] = [{
                    symbol: extracted.symbol,
                    value: validation.parsed
                }];
                continue;
            }

            properties[prop].push({
                symbol: extracted.symbol,
                value: validation.parsed
            });
        }

        return {
            query,
            type: "success",
            unnamed,
            properties,
            delimiter: this.config.tokenDelimiter
        };
    }

    private extractComparison(token: string): ComparisonExtraction {
        for (let i = 0; i < this.config.relationSymbols.length; i++) {
            const index = token.indexOf(this.config.relationSymbols[i]);

            if (index === -1) {
                continue;
            }

            return {
                isPresent: true,
                start: index,
                symbol: this.config.relationSymbols[i]
            }
        }

        return {
            isPresent: false
        };
    }

    private split(token: string, extraction: ComparisonExtractionTrue): [string, string] {
        return [
            token.substring(0, extraction.start),
            token.substring(extraction.start + extraction.symbol.length)
        ];
    }

    private validateProperty(prop: string, value: string, comparison: string): SearchPropertyValidation {
        if (this.config.propertyMap[prop] === undefined) {
            const props = Object.keys(this.config.propertyMap);
            const closest = props[closestLevenDist(prop, props)];

            return {
                isValid: false,
                error: {
                    message: `'${prop}' is not supported`,
                    suggestion: {
                        prop: closest,
                        description: `Did you mean ${closest}?`
                    }
                }
            };
        }

        return this.config.propertyMap[prop](value, comparison);
    }

    private createSuggestion(validationSuggestion: ValidationSuggestion | undefined, prop: string, symbol: string, value: string): SearchQuerySuggestion | undefined {
        if (validationSuggestion === undefined) {
            return undefined;
        }

        return {
            description: validationSuggestion.description,
            fullReplacement: (validationSuggestion.prop ?? prop) + (validationSuggestion.symbol ?? symbol) + (validationSuggestion.value ?? value)
        };
    }
}