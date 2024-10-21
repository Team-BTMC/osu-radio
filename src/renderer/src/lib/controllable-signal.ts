import { Accessor, createMemo, createSignal } from "solid-js";

type createControllableSignalParams<T> = {
  value?: Accessor<T | undefined>;
  defaultValue: T;
  onChange?: (newValue: T) => void;
};

type AnyFunction = (...args: any[]) => any;

function accessWith<T>(
  valueOrFn: T,
  ...args: T extends AnyFunction ? Parameters<T> : never
): T extends AnyFunction ? ReturnType<T> : T {
  return typeof valueOrFn === "function" ? valueOrFn(...args) : valueOrFn;
}

function createControllableSignal<T>(props: createControllableSignalParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = createSignal(props.defaultValue);
  const isControlled = createMemo(() => props.value?.() !== undefined);
  const value = createMemo(() => (isControlled() ? props.value?.() : uncontrolledValue()));

  const setValue = (next: T | ((prevValue: T) => T)) => {
    const nextValue = accessWith(next, value() as T);

    if (!Object.is(nextValue, value())) {
      if (!isControlled()) {
        setUncontrolledValue(nextValue as any);
      }

      props.onChange?.(nextValue);
    }
  };

  return [value, setValue] as const;
}

export default createControllableSignal;
