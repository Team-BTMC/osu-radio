export type DelayedFunction<F extends (...args: any[]) => any> = (...args: Parameters<F>) => number;

export type DelayCancel = () => void;

export function delay<F extends (...args: any[]) => any>(
  fn: F,
  ms: number,
): [DelayedFunction<F>, DelayCancel] {
  let timeout: number | undefined = undefined;

  return [
    (...args) => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        const got = fn(...args);
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
