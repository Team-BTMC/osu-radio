export type SearchQuerySuggestion = {
  description: string;
  fullReplacement: string;
};

export type SearchQueryError = {
  query: string;
  type: "error";
  error: {
    message: string;
    suggestion?: SearchQuerySuggestion;
    start: number;
    end: number;
  };
};

export type SearchProperty = {
  symbol: string;
  value: any;
};

export type SearchQuerySuccess = {
  query: string;
  type: "success";
  unnamed: string[];
  properties: Record<string, SearchProperty[]>;
  delimiter: string;
};

export type SearchQuery = SearchQueryError | SearchQuerySuccess;

export type SearchConfig = {
  tokenDelimiter: string;
  // Relation symbol provides meaning between two tokens. Example: bpm=200 - relation symbol is `=`
  relationSymbols: string[];
  propertyMap: SearchPropertyMap;
};

export type ValidationSuggestion = {
  prop?: string;
  symbol?: string;
  value?: string;
  description: string;
};

export type SearchPropertyValidation =
  | {
      isValid: false;
      error: {
        message: string;
        suggestion?: ValidationSuggestion;
      };
    }
  | {
      isValid: true;
      parsed: any; // Represents value that is serialized in string. Example: value = String("727") -> parsed = Number(727)
    };

// Function that shall validate user input
export type SearchPropertyValidator = (value: string, symbol: string) => SearchPropertyValidation;

// All available tokens for searching. Example: "bpm": num()
export type SearchPropertyMap = {
  [key: string]: SearchPropertyValidator;
};
