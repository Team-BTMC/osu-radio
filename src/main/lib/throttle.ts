export type ThrottledFunction<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => NodeJS.Timeout;
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
  ms: number
): [ThrottledFunction<F>, ThrottleCancel] {
  let timeout: NodeJS.Timeout | undefined = undefined;

  return [
    (...args) => {
      if (timeout !== undefined) {
        // Ignore all calls
        return timeout;
      }

      // Save timeout ID
      timeout = setTimeout(() => {
        const got = fn(...args);

        // Remove timeout ID so that next call will get throttled
        if (got instanceof Promise) {
          got.then(() => (timeout = undefined));
          return;
        }

        timeout = undefined;
      }, ms);

      return timeout;
    },
    () => clearTimeout(timeout),
  ];
}
