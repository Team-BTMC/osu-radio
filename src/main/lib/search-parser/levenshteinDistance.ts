// https://www.30secondsofcode.org/js/s/levenshtein-distance/ optimized
export function levenshteinDistance(s: string, t: string): number {
    if (s.length === 0) {
        return t.length
    }

    if (t.length === 0) {
        return s.length
    }

    const bufferSize = s.length + 1;
    const matrix = new Uint32Array((t.length + 1) * bufferSize);

    for (let i = 0; i <= t.length; i++) {
        matrix[i * bufferSize] = i;

        for (let j = 1; j <= s.length; j++) {
            if (i === 0) {
                matrix[j] = j;
                continue;
            }

            matrix[i * bufferSize + j] = Math.min(
                matrix[(i - 1) * bufferSize + j] + 1,
                matrix[i * bufferSize + j - 1] + 1,
                matrix[(i - 1) * bufferSize + j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
        }
    }

    return matrix[matrix.length - 1];
}



export function closestLevenDist(string: string, values: string[]): -1 | number {
    if (values.length === 0) {
        return -1;
    }

    let min = Number.MAX_SAFE_INTEGER;
    let index = -1;

    for (let i = 0; i < values.length; i++) {
        const distance = levenshteinDistance(string, values[i]);

        if (distance > min) {
            continue;
        }

        min = distance;
        index = i;
    }

    return index;
}