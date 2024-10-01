import { SearchPropertyValidation, SearchPropertyValidator } from './@search-types';
import { closestLevenDist } from './levenshteinDistance';



export const equalsSymbols = ['=', '==', '!='];
export const greaterThanSymbols = ['>', '>='];
export const lessThanSymbols = ['<', '<='];

export const defaultRelationSymbols = [...equalsSymbols, ...greaterThanSymbols, ...lessThanSymbols];



export function text(): SearchPropertyValidator {
  return (value: string, symbol: string): SearchPropertyValidation => {
    if (!(symbol === '=' || symbol === '!=' || symbol === '==')) {
      return {
        isValid: false,
        error: {
          message: 'Text can only use =, ==, != comparison symbols.',
          suggestion: {
            symbol: '=',
            description: 'Use equals instead.'
          }
        }
      };
    }

    return {
      isValid: true,
      parsed: value
    };
  };
}



export function num(includeFloats = true): SearchPropertyValidator {
  const integerRegex = /^[0-9]+$/;

  return (value, symbol): SearchPropertyValidation => {
    if (!defaultRelationSymbols.includes(symbol)) {
      return {
        isValid: false,
        error: {
          message: `Numbers can only use ${defaultRelationSymbols.join(', ')} comparison symbols.`
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
      };
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
    };
  };
}



export function set(set: string[], caseSensitive = true): SearchPropertyValidator {
  if (set.length === 0) {
    throw new Error('Set must have at least one value.');
  }

  // Apply normalization to set values
  for (let i = 0; i < set.length; i++) {
    const v = caseSensitive ? set[i] : set[i].toLowerCase();
    const index = set.indexOf(v);

    // Index of normalized value is same as current index (apples = apples.lower())
    if (i === index) {
      continue;
    }

    // Normalized value is not present in set (Bananas != Bananas.lower()) thus replace with normalized value
    if (index === -1) {
      set[i] = v;
      continue;
    }

    // Remove duplicated value
    set.splice(i, 1);
  }

  return (value, symbol): SearchPropertyValidation => {
    if (!(symbol === '=' || symbol === '!=' || symbol === '==')) {
      return {
        isValid: false,
        error: {
          message: 'Set can only use =, ==, != comparison symbols.',
          suggestion: {
            symbol: '=',
            description: 'Use equals instead.'
          }
        }
      };
    }

    const values = value.split(',');
    const setValues = [...set];

    for (let i = 0; i < values.length; i++) {
      const j = setValues.indexOf(values[i]);

      if (j !== -1) {
        setValues.splice(j, 1);
        continue;
      }

      // Value was not found in set. Suggest the closest value from set
      const incorrectValue = values[i];
      const index = closestLevenDist(incorrectValue, setValues);
      let description = '';

      if (index === -1) {
        // Submitted value is completely wrong. Suggest user to remove it
        values.splice(i, 1);
        description = `Remove '${incorrectValue}'`;
      } else {
        // User made a typo suggest correct value (tile -> title)
        values[i] = set[index];
        description = `Did you mean '${set[index]}'?`;
      }

      return {
        isValid: false,
        error: {
          message: `'${incorrectValue}' is not one of these values: ${set.join(', ')}`,
          suggestion: {
            value: values.join(','),
            description
          }
        }
      };
    }

    return {
      isValid: true,
      parsed: values
    };
  };
}



/**
 * Supports multiple values for:
 * - `true`: true, yes, 1
 * - `false`: false, no, 0
 */
export function bool(): SearchPropertyValidator {
  return set(['true', 'false', 'yes', 'no', '1', '0'], false);
}



const timeExtractors: [RegExp, (matches: RegExpMatchArray) => any][] = [
  [/^([0-9]+)s?$/, (matches: RegExpMatchArray) => Number(matches[1])],
  [/^([0-9]+)m$/, (matches: RegExpMatchArray) => Number(matches[1]) * 60],
  [/^([0-9]+):([0-9]+)$/, (matches: RegExpMatchArray) => Number(matches[1]) * 60 + Number(matches[2])]
];

/**
 * Supports multiple time formats
 * - `{seconds}` or `{seconds}s`
 * - `{minutes}m`
 * - `{minutes}:{seconds}`
 */
export function time(): SearchPropertyValidator {
  return (value: string, symbol: string): SearchPropertyValidation => {
    if (!defaultRelationSymbols.includes(symbol)) {
      return {
        isValid: false,
        error: {
          message: `Time can only use ${defaultRelationSymbols.join(', ')} comparison symbols.`
        }
      };
    }

    // Find used format and return parsed value in seconds
    for (let i = 0; i < timeExtractors.length; i++) {
      const [regex, constructor] = timeExtractors[i];
      const matches = regex.exec(value);

      if (matches === null) {
        continue;
      }

      return {
        isValid: true,
        parsed: constructor(matches)
      };
    }

    // No smart suggestion because the used format is unknown. Suggest default 0:0 with `{minutes}:{seconds}` format
    return {
      isValid: false,
      error: {
        message: 'Not recognised time format.',
        suggestion: {
          value: '0:00',
          description: 'Try using minutes:seconds format.'
        }
      }
    };
  };
}