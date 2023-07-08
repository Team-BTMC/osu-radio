import { SearchPropertyValidation, SearchPropertyValidator } from "./@search-types";
import { closestLevenDist } from "./levenshteinDistance";



export const equalsSymbols = ["=", "==", "!="];
export const greaterThanSymbols = [">", ">="];
export const lessThanSymbols = ["<", "<="];

export const defaultRelationSymbols = [...equalsSymbols, ...greaterThanSymbols, ...lessThanSymbols];



export function TextSearchProperty(): SearchPropertyValidator {
    return (value: string, symbol: string): SearchPropertyValidation => {
        if (!(symbol === "=" || symbol === "!=" || symbol === "==")) {
            return {
                isValid: false,
                error: {
                    message: "Text can only use =, ==, != comparison symbols.",
                    suggestion: {
                        symbol: "=",
                        description: "Use equals instead."
                    }
                }
            };
        }

        return {
            isValid: true,
            parsed: value
        };
    }
}



export function NumberSearchProperty(includeFloats = true): SearchPropertyValidator {
    const integerRegex = /^[0-9]+$/;

    return (value, symbol): SearchPropertyValidation => {
        if (!defaultRelationSymbols.includes(symbol)) {
            return {
                isValid: false,
                error: {
                    message: `Numbers can only use ${defaultRelationSymbols.join(", ")} comparison symbols.`
                }
            };
        }

        if (includeFloats) {
            const parsed = Number(value);
            if (isNaN(parsed)) {
                return {
                    isValid: false,
                    error: {
                        message: `'${value}' is not valid number value.`
                    }
                };
            }

            return {
                isValid: true,
                parsed
            }
        }

        if (!integerRegex.test(value)) {
            return {
                isValid: false,
                error: {
                    message: `'${value}' is not valid integer value.`
                }
            };
        }

        return {
            isValid: true,
            parsed: Number(value)
        }
    }
}



export function SetSearchProperty(set: string[], caseSensitive = true): SearchPropertyValidator {
    if (set.length === 0) {
        throw new Error("Set must have at least one value.");
    }

    for (let i = 0; i < set.length; i++) {
        const v = caseSensitive ? set[i] : set[i].toLowerCase();

        const index = set.indexOf(v);

        if (i === index || index === -1) {
            set[i] = v;
            continue;
        }

        set.splice(i, 1);
    }

    return (value, symbol): SearchPropertyValidation => {
        if (!(symbol === "=" || symbol === "!=" || symbol === "==")) {
            return {
                isValid: false,
                error: {
                    message: "Set can only use =, ==, != comparison symbols.",
                    suggestion: {
                        symbol: "=",
                        description: "Use equals instead."
                    }
                }
            };
        }

        const values = value.split(",");
        const setValues = [...set];

        for (let i = 0; i < values.length; i++) {
            const j = setValues.indexOf(values[i]);

            if (j !== -1) {
                setValues.splice(j, 1);
                continue;
            }

            const incorrectValue = values[i];
            const index = closestLevenDist(incorrectValue, setValues);
            let description = "";

            if (index === -1) {
                values.splice(i, 1);
                description = `Remove '${incorrectValue}'`;
            } else {
                values[i] = set[index];
                description = `Did you mean '${set[index]}'?`;
            }

            return {
                isValid: false,
                error: {
                    message: `'${incorrectValue}' is not one of these values: ${set.join(", ")}`,
                    suggestion: {
                        value: values.join(","),
                        description
                    },
                }
            }
        }

        return {
            isValid: true,
            parsed: values
        }
    }
}



export function BooleanSearchProperty(): SearchPropertyValidator {
    return SetSearchProperty(["true", "false", "yes", "no", "1", "0"], false);
}