export type ThrottledFunction<F extends (...args: any[]) => any> = (...args: Parameters<F>) => NodeJS.Timeout;

export type ThrottleCancel = () => void;

export function throttle<F extends (...args: any[]) => any>(fn: F, ms: number): [ThrottledFunction<F>, ThrottleCancel] {
  let timeout: NodeJS.Timeout | undefined = undefined;

  return [(...args) => {
    if (timeout !== undefined) {
      return timeout;
    }

    timeout = setTimeout(() => {
      const got = fn(...args);
      if (got instanceof Promise) {
        got.then(() => timeout = undefined);
        return;
      }

      timeout = undefined;
    }, ms);

    return timeout;
  }, () => clearTimeout(timeout)];
}