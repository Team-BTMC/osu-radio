export type ThrottledFunction<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => number;
export type ThrottleCancel = () => void;

/**
 * Wraps `fn` in throttled function. Calling this function will ignore and skip all calls until the initial call is
 * resolved. Afterward the function will not go back to skipped calls and "waits" for next call
 *
 * @param fn
 * @param ms
 */
export function throttle<F extends (...args: any[]) => any>(
  fn: F,
  ms: number,
): [ThrottledFunction<F>, ThrottleCancel] {
  let timeoutId: number | undefined = undefined;

  return [
    (...args) => {
      if (timeoutId !== undefined) {
        // Ignore all calls
        return timeoutId;
      }

      // Save timeout ID
      timeoutId = window.setTimeout(() => {
        const got = fn(...args);

        // Remove timeout ID so that next call will get throttled
        if (got instanceof Promise) {
          got.then(() => (timeoutId = undefined));
          return;
        }

        timeoutId = undefined;
      }, ms);

      return timeoutId;
    },
    () => clearTimeout(timeoutId),
  ];
}
