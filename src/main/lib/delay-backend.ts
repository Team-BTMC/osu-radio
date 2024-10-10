export type DelayedFunction<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => NodeJS.Timeout;

export type DelayCancel = () => void;

/**
 * Provided `fn` is wrapped and calling returned wrapped function will cause that all calls to that function will be
 * delayed. If function is called while it is being delayed the delay timer will reset and start over
 * @param fn
 * @param ms
 */
export function delay<F extends (...args: any[]) => any>(
  fn: F,
  ms: number
): [DelayedFunction<F>, DelayCancel] {
  let timeout: NodeJS.Timeout | undefined = undefined;

  return [
    (...args) => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        const got = fn(...args);
        if (got instanceof Promise) {
          got.then(() => (timeout = undefined));
          return;
        }

        timeout = undefined;
      }, ms);

      return timeout;
    },
    () => clearTimeout(timeout)
  ];
}
