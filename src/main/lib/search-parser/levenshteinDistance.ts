import { distance } from 'fastest-levenshtein';



/**
 * Compute Levenshtein distance for all values using `string` and return index to value that is the closest match
 * @param string
 * @param values
 */
export function closestLevenDist(string: string, values: string[]): -1 | number {
    if (values.length === 0) {
        return -1;
    }

    let min = Number.MAX_SAFE_INTEGER;
    let index = -1;

    for (let i = 0; i < values.length; i++) {
        const dist = distance(string, values[i]);

        if (dist > min) {
            continue;
        }

        min = dist;
        index = i;
    }

    return index;
}