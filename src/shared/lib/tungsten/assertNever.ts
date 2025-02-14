/**
 * Code shall never reach this path
 */
export function assertNever(value: never) {
  throw new Error("Unexpected value: " + value);
}
