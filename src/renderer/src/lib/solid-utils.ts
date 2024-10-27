type AnyFunction = (...args: any[]) => any;

export function accessWith<T>(
  valueOrFn: T,
  ...args: T extends AnyFunction ? Parameters<T> : never
): T extends AnyFunction ? ReturnType<T> : T {
  return typeof valueOrFn === "function" ? valueOrFn(...args) : valueOrFn;
}
