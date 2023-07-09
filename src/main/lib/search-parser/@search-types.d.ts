export type SearchQuerySuggestion = {
    description: string,
    fullReplacement: string
}

export type SearchQueryError = {
    query: string,
    type: "error",
    error: {
        message: string,
        suggestion?: SearchQuerySuggestion,
        start: number,
        end: number
    },
}

export type SearchProperty = {
    symbol: string,
    value: any
}

export type SearchQuerySuccess = {
    query: string,
    type: "success",
    unnamed: string[],
    properties: Record<string, SearchProperty[]>,
    delimiter: string
}

export type SearchQuery = SearchQueryError | SearchQuerySuccess



export type SearchConfig = {
    tokenDelimiter: string,
    relationSymbols: string[],
    propertyMap: SearchPropertyMap
}

export type ValidationSuggestion = {
    prop?: string
    symbol?: string,
    value?: string
    description: string
}

export type SearchPropertyValidation = {
    isValid: false,
    error: {
        message: string,
        suggestion?: ValidationSuggestion
    },
} | {
    isValid: true,
    parsed: any
}

export type SearchPropertyValidator = (value: string, symbol: string) => SearchPropertyValidation

export type SearchPropertyMap = {
    [key: string]: SearchPropertyValidator
}